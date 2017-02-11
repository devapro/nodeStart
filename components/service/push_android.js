/**
 * Send android push
 */

'use strict';

const log = require('../log')(module);
const config = require('../config');
const gcm = require('node-gcm');

const m = {};

m.send = function (ids, title, message, payload) {
    log.debug('android push ' + title + '  ' + message);
    // create message

    // var gcm_message = new gcm.Message({
    //     data:{
    //         title: title,
    //         body: message,
    //         icon: 'ic_launcher'
    //     }
    // });

    var gcm_message = new gcm.Message();
    gcm_message.addNotification({
        title: title,
        body: message,
        icon: 'ic_launcher'
    });

    if(payload){
        gcm_message.addData(payload);
    }

    // Set up the sender with you API key
    var sender = new gcm.Sender(config.get("push:gcm_sender"));
    // ... or retrying a specific number of times (10)
    sender.send(gcm_message, { registrationTokens: ids }, 10, function (err, response) {
        if(err) log.error(err);
        else    log.info(response);
    });
};

module.exports = m;