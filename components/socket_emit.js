/**
 * Emit socket event
 */

'use strict';

const log = require('./log')(module);
const UserModel = require('../models/UserModel').UserModel;

const push_android = require('./service/push_android');
const push_ios = require('./service/push_ios');
const async = require('async');


module.exports = function (user_ids, event, data, exclude) {

    if(user_ids.length == 0){
        log.error("empty ids list");
        return;
    }

    var socket_ids = [];
    async.forEachOfSeries(user_ids,
        function (user_id, key, callback) {
            UserModel.findById(user_id, function (err, user) {
                if(err){
                    log.error("Notification module -> find user " + err);
                } else if(user == null){
                    log.error("Notification module -> find user Not found");
                } else {
                    // socket ids
                    if(user.socket_ids && user.socket_ids.length > 0){
                        socket_ids = socket_ids.concat(user.socket_ids);
                    }
                }
                callback();
            });
        },
        function (err) {
            if(err){
                log.error("Notification module -> forEachOfSeries " + err);
            }

            var wrong_socket_ids = [];
            for(var i = 0; i < socket_ids.length; i++){
                if(exclude && exclude == socket_ids[i]){
                    continue;
                }
                if(global.io.sockets.sockets[socket_ids[i]]){
                    global.io.sockets.sockets[socket_ids[i]].emit(event, data);
                } else {
                    wrong_socket_ids.push(socket_ids[i]);
                }
            }
            if(wrong_socket_ids.length > 0){
                for(var i = 0; i < wrong_socket_ids.length; i++){
                    UserModel.findOneAndUpdate({socket_ids: wrong_socket_ids[i]}, {
                        $pull: {socket_ids: wrong_socket_ids[i]}
                    }, function (err) {
                        if(err){
                            log.error("Socket emit, Error remove wrong components");
                        }
                    });
                }
            }
        }
    );
};