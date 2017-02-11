/**
 * Socket
 */

'use strict';

const async = require('async');
const config = require('./config');
const mongoose = require('./mongoose').mongoose;
const log = require('./log')(module);
const UserModel = require('../models/UserModel').UserModel;
const MessageModel = require('../models/MessageModel').MessageModel;
const socket_emit = require('./socket_emit');
const push_ios = require('./service/push_ios');
const push_android = require('./service/push_android');

// object response
var ApiResponse = function(){
    return {
        status: 200,
        message: "",
        data: {},
        errors: {}
    }
};

module.exports = function (server) {
    var io = require('socket.io')(server);

    io.set('authorization', function (handshakeData, accept) {
        accept(null, true);
    });

    io.sockets.on('connection', function (socket) {
        log.info("ws connect");
        setTimeout(function(){
            socket.emit('init', {message: "connect ok"});
        }, 1000);

        socket.on('subscribe', function (data) {
            log.info('subscribe');
            log.info(socket.id);
            log.info(data);
            UserModel.findByToken(data.token, function (err, user) {
                var response = new ApiResponse();
                if(err || user == null){
                    response.message = "Invalid token";
                    response.status = 403;
                    response.errors = {token:"Invalid token"};
                    socket.emit('socket_error', {message: "Invalid token"});
                    return;
                } else {
                    // save socket id
                    UserModel.findOneAndUpdate({_id : user._id}, {$push: {"socket_ids": socket.id}}, function (err) {
                        if(err){
                            log.error(err);
                        }
                    });
                }
                // send result
                socket.emit('auth', response);
            });
        });

        socket.on('disconnect', function (sock) {
            log.info("ws disconnect");
            log.info(socket.id);
            // remove socket id from profile
            UserModel.findOneAndUpdate(
                {socket_ids: socket.id},
                {$pull: {"socket_ids": socket.id}},
                {new: true}
            ).exec(function (err, user) {
                if(err){
                    log.error("Error remove socket id");
                    log.error(err);
                }
            });
        });

        /**
         * Typing
         */
        socket.on('typing', function (data) {
            log.info("ws typing");
            log.info(data);
            if(data.recipient_id == ""){
                return;
            }
            if(!mongoose.Types.ObjectId.isValid(data.recipient_id.toString())){
                socket.emit('socket_error', {message: "Invalid recipient id"});
                return;
            }

            var sender = false;
            var recipient = false;
            async.parallel([
                // find sender
                function (cb) {
                    UserModel
                        .findOne({socket_ids: socket.id})
                        .exec()
                        .then(function (user) {
                            if(user == null){
                                socket.emit('socket_error', {message: "Sender profile not found"});
                                cb(true);
                            } else {
                                sender = user;
                            }
                        })
                        .catch(function (err) {
                            cb(err);
                        });
                },
                // find recipient
                function (cb) {
                    UserModel
                        .findOne({_id: data.recipient_id})
                        .exec()
                        .then(function (user) {
                            if(user == null){
                                socket.emit('socket_error', {message: "Recipient profile not found"});
                                cb(true);
                            } else {
                                recipient = user;
                            }
                        })
                        .catch(function (err) {
                            cb(err);
                        });
                }
            ], function (err) {
                if(err){
                    log.error();
                } else {
                    if(!recipient.socket_ids || !recipient.socket_ids.length || recipient.socket_ids.length == 0){
                        return;
                    }
                    // send to recipient
                    var wrong_socket_ids = [];
                    for(var i = 0; i < recipient.socket_ids.length; i++){
                        if(io.sockets.sockets[recipient.socket_ids[i]]){
                            io.sockets.sockets[recipient.socket_ids[i]].emit('typing', {
                                sender_id : sender._id
                            });
                        } else {
                            wrong_socket_ids.push(recipient.socket_ids[i]);
                        }
                    }
                    if(wrong_socket_ids.length > 0){
                        // Update user profile
                        UserModel.findOneAndUpdate(
                            {_id: recipient._id},
                            {$pull: { socket_ids: wrong_socket_ids }}
                        ).exec(function (err) {
                            if(err){
                                log.error(err);
                            }
                        });
                    }
                }
            });
        });

        /**
         * Send message
         */
        socket.on('send_message', function (data) {
            log.info("ws send_message");
            log.info(data);
            if(data.text){
                data.text = data.text.trim();
            }
            if(!mongoose.Types.ObjectId.isValid(data.recipient_id)){
                socket.emit('socket_error', {message: "Invalid recipient id"});
                return;
            }
            if(data.text == ""){
                socket.emit('socket_error', {message: "Empty message"});
                return;
            }

            var sender = false;
            var recipient = false;
            async.parallel([
                // find sender
                function (cb) {
                    UserModel
                        .findOne({socket_ids: socket.id})
                        .exec()
                        .then(function (user) {
                            if(user == null){
                                socket.emit('socket_error', {message: "Sender profile not found"});
                                cb({message: "Sender profile not found"});
                            } else {
                                sender = user;
                                cb();
                            }
                        })
                        .catch(function (err) {
                            cb(err);
                        });
                },
                // find recipient
                function (cb) {
                    UserModel
                        .findOne({_id: data.recipient_id})
                        .exec()
                        .then(function (user) {
                            if(user == null){
                                socket.emit('socket_error', {message: "Recipient profile not found"});
                                cb({message: "Recipient profile not found"});
                            } else {
                                recipient = user;
                                cb();
                            }
                        })
                        .catch(function (err) {
                            cb(err);
                        });
                }
            ], function (err) {
                if(err){
                    log.error(err);
                } else {
                    // save message
                    var message = new MessageModel({
                        sender : sender._id,
                        recipient : recipient._id
                    });

                    if(data.text){
                        message.text = data.text;
                    }

                    if(data.image){
                        message.image = data.image;
                    }

                    if(data.location && data.location.lat && data.location.lon){
                        message.location = {};
                        message.location.lat = data.location.lat;
                        message.location.lon = data.location.lon;
                    }

                    message.save(function (err, m) {
                        if(err){
                            log.error(err);
                            var errors = {};
                            for (var er in err.errors) {
                                errors[er] = err.errors[er].message;
                            }
                            socket.emit('socket_error', errors);
                        } else {
                            console.log(message.getPublicFields());
                            // send to socket
                            socket_emit([message.sender, message.recipient], 'new_message', message.getPublicFields());

                            // send push to recipient
                            if(!recipient.socket_ids || !recipient.socket_ids.length || recipient.socket_ids.length == 0){
                                var text = m.text ? m.text : "";

                                var avatar = sender.avatar ? config.get("base_url") + config.get("urls:url_avatar_full") + sender.avatar : config.get("base_url") + "/public/images/user.png";

                                if(recipient.push_device_ios && recipient.push_device_ios.length > 0){
                                    push_ios.send(recipient.push_device_ios, "New message " + text, sender.name, {
                                        type: 'new_message',
                                        sender_id: sender._id.toString(),
                                        avatar: avatar
                                    });
                                }
                                if(recipient.push_device_android && recipient.push_device_android.length > 0){
                                    push_android.send(recipient.push_device_android, "New message " + text, sender.name, {
                                        type: 'new_message',
                                        sender_id: sender._id.toString(),
                                        avatar: avatar,
                                        name: sender.name,
                                        message: text
                                    });
                                }

                            }
                        }
                    });
                }
            });
        });

        /**
         * Read messages
         */
        socket.on('read_messages', function (data) {
            log.info("ws read_messages");
            log.info(data);

            // mark read all dialog
            if(mongoose.Types.ObjectId.isValid(data.sender)){
                UserModel
                    .findOne({socket_ids: socket.id})
                    .exec()
                    .then(function (user) {
                        if(user == null){
                            socket.emit('socket_error', {message: "Sender profile not found"});
                        } else {
                            MessageModel.update(
                                {sender: data.sender, recipient: user._id},
                                {is_read: true},
                                {multi: true},
                                function (err) {
                                    if(err){
                                        log.error(err);
                                        socket.emit('socket_error', {message: "Server error"});
                                    }
                                });
                        }
                    })
                    .catch(function (err) {
                        log.error(err);
                        socket.emit('socket_error', {message: "Server error"});
                    });
                return;
            }

            // mark only selected messages
            if(!data.messages || !data.messages.forEach){
                socket.emit('socket_error', {message: "Messages must be an array"});
                return;
            }

            UserModel
                .findOne({socket_ids: socket.id})
                .exec()
                .then(function (user) {
                    if(user == null){
                        socket.emit('socket_error', {message: "Sender profile not found"});
                    } else {
                        MessageModel.update(
                            {_id: {$in : data.messages}, recipient: user._id},
                            {is_read: true},
                            {multi: true},
                            function (err) {
                                if(err){
                                    log.error(err);
                                    socket.emit('socket_error', {message: "Server error"});
                                }
                            });
                    }
                })
                .catch(function (err) {
                    log.error(err);
                    socket.emit('socket_error', {message: "Server error"});
                });

        });

    });

    global.io = io;
    return io;
};