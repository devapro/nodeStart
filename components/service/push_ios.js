/**
 * Send ios push
 */

'use strict';

const log = require('../log')(module);
const config = require('../config');
const apn = require('apn');

const m = {};

m.send = function (ids, title, message, payload) {
    log.debug('ios push ' + title + '  ' + message);
    if(!ids.length || ids.length == 0){
        return;
    }
    var options = {
        key : config.get("push:ios_key"),
        cert : config.get("push:ios_cert"),
        production : false
    };
    var apnConnection = new apn.Connection(options);

    var myDevices = [];
    for(var i=0; i < ids.length; i++){
        myDevices.push(new apn.Device(ids[i]));
    }

    var note = new apn.Notification();
    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = title;
    if(payload){
        note.payload = payload;
    }
    if(!note.payload){
        note.payload = {};
    }
    note.payload.messageFrom = message;

    apnConnection.pushNotification(note, myDevices);

    /**
     * Send to dev
     * @type {{key: String, cert: String, production: boolean}}
     */
    var options_dev = {
        key : config.get("push:dev_ios_key"),
        cert : config.get("push:dev_ios_cert"),
        production : false
    };
    var apnConnection_dev = new apn.Connection(options_dev);

    apnConnection_dev.pushNotification(note, myDevices);
};

module.exports = m;