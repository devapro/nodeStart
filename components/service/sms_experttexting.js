/**
 * Send sms
 * experttexting.com
 *
 * Sample URL

 https://www.experttexting.com/ExptRestApi/sms/json/Message/Send?username=starcity&password=StarCity123&api_key=sswmp8r7l63y&from=BRANDSMS&to=123456789&text=Hello&type=text

 JSON Response (Success)

 {
    "Response": {
       "message_id": "671729375",
       "message_count": 1,
       "price": 0.0085
    },
    "ErrorMessage": "",
    "Status": 0
 }
 */

'use strict';

const request = require("request");
const querystring = require('querystring');
const log = require('../log')(module);

var Sms = {};

Sms.send = function(phone, text, cb){
    phone = phone.toString().match(/\d/g);
    phone = phone.join("");
    var url = "https://www.experttexting.com/ExptRestApi/sms/json/Message/Send?username=jabrool&password=ABC12345&api_key=w84ccyknuehi7g6&from=jabrool&";
    var form = {
        to: phone,
        text: text
    };
    var formData = querystring.stringify(form);
    request(
        {
            uri: url+formData,
            method: 'GET'
        },function (error, res, body) {
            if (!error) {
                log.debug(body);
                try{
                    var json = JSON.parse(body);
                    if(json.Status != 0){
                        log.error("Sms error send to " + phone);
                        cb(false);
                    } else {
                        log.debug("Sms success send to " + phone);
                        cb(json.message_id);
                    }
                } catch(e){
                    log.error("error get ok groups parse json");
                    log.error(e);
                    log.error(body);
                    cb(false);
                }
            } else {
                log.error("get ok groups");
                log.error(error);
                log.error(body);
                cb(false);
            }
        }
    );
};



module.exports = Sms;