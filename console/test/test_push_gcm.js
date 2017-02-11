// https://github.com/ToothlessGear/node-gcm

var gcm = require('node-gcm');

// ... or some given values
// var message = new gcm.Message({
//     collapseKey: 'prod',
//     priority: 'high',
//     contentAvailable: true,
//     delayWhileIdle: true,
//     timeToLive: 3,
//     restrictedPackageName: "pro.devapp.kittos",
//     dryRun: true,
//     data: {
//         key1: 'message1'
//     },
//     notification: {
//         title: "Hello, World",
//         icon: "ic_launcher",
//         body: "This is a notification that will be displayed ASAP."
//     }
// });
//
// // Change the message data
// // ... as key-value
// message.addData('key1','message1');
//
// // ... or as a data object (overwrites previous data object)
// message.addData({
//     key1: 'message1'
// });

var message = new gcm.Message();

// Add notification payload as key value
message.addNotification('title', 'Alert!!!');
message.addNotification('body', 'Abnormal data access');
message.addNotification('icon', 'ic_launcher');

// as object
message.addNotification({
    title: 'Alert!!!',
    body: 'Abnormal data access',
    //icon: 'ic_launcher'
});

// Set up the sender with you API key
var sender = new gcm.Sender('AIzaSyDZfWaMBwiTAq6KUtJLLi4g8IgbDeDzBNo');


// Add the registration tokens of the devices you want to send to
var registrationTokens = [];
registrationTokens.push('ecn76ZIol68:APA91bGCvFJHm9tBF8oVzSE7zoyMxMtdeDYjB-5c4oSxznw1cwJVugVKoafEhvkJgSQP0N2ZzFEvirb7CeYG87DDJrfZH5jxgfDDEle9Lz2mwnRQj9brcN1faYByKQ1pxb7ZQ_15Z67w');

// Send the message
// ... trying only once
sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
    if(err) console.error(err);
    else    console.log(response);
});

// ... or retrying
sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});

// ... or retrying a specific number of times (10)
sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
    if(err) console.error(err);
    else    console.log(response);
});