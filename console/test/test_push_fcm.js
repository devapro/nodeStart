'use strict';

const fcm = require('../../components/service/push_fcm');

//fcm.send("ftUDVZzxe4Q:APA91bE5IRYIaNBaWG4k3DBVJsSgEVUtaag5OBniInyGrqNQHLTdoMfr1Ie_bWwzkDYy-m5PdB8q-RwJiHtZjBirS68110xFPqoAAlMJL4GWUv5pv_5yE-t8xPcbzvxi5xWIbD1hO4wm", "title", "message");

fcm.sendData("ftUDVZzxe4Q:APA91bE5IRYIaNBaWG4k3DBVJsSgEVUtaag5OBniInyGrqNQHLTdoMfr1Ie_bWwzkDYy-m5PdB8q-RwJiHtZjBirS68110xFPqoAAlMJL4GWUv5pv_5yE-t8xPcbzvxi5xWIbD1hO4wm", {
    event_name: "Test",
    event_date: "wqeqe"
});