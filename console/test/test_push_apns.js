'use strict';

/**
 * Send ios push
 */
//var log = require('../../components/log')(module);
var config = require('../../components/config');
var apn = require('apn');


var options = {
    key : config.get("push:ios_key"),
    cert : config.get("push:ios_cert"),
    production : false
};
var apnConnection = new apn.Connection(options);


var devices = [
    "ee29a261a13923de610d00ebc24d7cda82b73cd946bfb89f999c2592f664716d",
    "a29d6e50405d76c3e73ab556b065edf3b0a8b9540403e3fd89871c12b749633b",
    "3baeb266d56c37aa0e4818087d24e29f6fcaca6bcec44d2bd0600ba7980c3a70",
    "f8e2b322dd6ace929fb666d125f7ff71a1026a8358480a5d08a8f47943363c92",
    "e63048253dc3152397ad4caba0b9cd6e84dae9768f275e88fb6458c5578614ce",
    "914df2e59b5e101e4da8c476e831a6fd171673050968eec96ebe5471132da026",
    "9c24de531b952863debb5993f197cc9e515ff54d458031c9231cd7d0426fb89c",
    "c135146c4e73dda3ef2adfa79d8b8fc6c86d19a92034eb8ea2373d0c53063a12"
];

var myDevices = [];
for(var i=0; i < devices.length; i++){
    myDevices.push(new apn.Device(devices[i]));
}

var myDevice = new apn.Device("c135146c4e73dda3ef2adfa79d8b8fc6c86d19a92034eb8ea2373d0c53063a12");

var note = new apn.Notification();
note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.

note.badge = 1;
note.sound = "ping.aiff";
note.alert = "TEST";
note.payload = {'messageFrom': "test"};

// note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
// note.badge = 3;
// note.sound = "ping.aiff";
// note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
// note.payload = {'messageFrom': 'Caroline'};

var res = apnConnection.pushNotification(note, myDevices);

console.log(res);


var options2 = {
    "batchFeedback": true,
    "interval": 300,
    key : config.get("push:ios_key"),
    cert : config.get("push:ios_cert"),
    debug : true
};


//
// var feedback = new apn.Feedback(options2);
// feedback.on("feedback", function(devices) {
//     devices.forEach(function(item) {
//         try{
//             console.log(item.device);
//         } catch(e){
//             console.log(e);
//         }
//         // Do something with item.device and item.time;
//     });
// });