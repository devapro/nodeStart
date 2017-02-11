/**
 * Send fcm push
 */

'use strict';

const log = require('../log')(module);
const config = require('../config');
const FCM = require('fcm-push');

const fcm = new FCM(config.get("push:gcm_sender"));

const m = {};

m.send = function (ids, title, message, payload) {
    log.debug('fcm push ' + title + '  ' + message);
    if(!ids || !ids.length || ids.length == 0){
        log.error("Empty ids");
        return;
    }

    if(!ids.forEach){
        ids = [ids];
    }

    ids.forEach(function (val, key, array) {
        var mes = {
            to: val, // required fill with device token or topics
            // data: {
            //     title: title,
            //     body: message,
            //     icon: 'ic_launcher',
            //     expiry: Math.floor(Date.now() / 1000) + 3600,
            //     badge: 1,
            //     sound: "ping.aiff",
            //     alert: title
            // },
            priority: 'high',
            notification: {
                title: title,
                body: message,
                icon: 'ic_launcher',
                expiry: Math.floor(Date.now() / 1000) + 3600,
                badge: 1,
                sound: "ping.aiff",
                alert: title
            }
        };

        //promise style
        fcm.send(mes)
            .then(function(response){
                log.info("Successfully sent with response: ", response);
            })
            .catch(function(err){
                log.info("Something has gone wrong!");
                log.error(err);
            });
    });
};

m.sendData = function (ids, data) {

    if(!ids || !ids.length || ids.length == 0){
        log.error("Empty ids");
        return;
    }

    if(!ids.forEach){
        ids = [ids];
    }

    ids.forEach(function (val, key, array) {
        var mes = {
            to: val, // required fill with device token or topics
            data: data,
            priority: 'high',
            notification: {}
        };

        //promise style
        fcm.send(mes)
            .then(function(response){
                log.info("Successfully sent with response: ", response);
            })
            .catch(function(err){
                log.info("Something has gone wrong!");
                log.error(err);
            });
    });
};

module.exports = m;