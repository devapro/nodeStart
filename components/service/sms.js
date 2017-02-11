/**
 * Send sms
 *
 * Sample URL

 http://la.cellactpro.com/http_req.asp?FROM=orbita&USER=igorke&PASSWORD=eva951951&APP=LA&CMD=sendtextmt&SENDER=orbita&CONTENT=Test&TO=+79381453173&SN=SMS&MSGID=123456

 */

'use strict';

const request = require("request");
const querystring = require('querystring');
const log = require('../log')(module);

var Sms = {};

Sms.send = function(phone, text, cb){
    phone = phone.toString().match(/\d/g);
    phone = phone.join("");
    //nfYT632jsE0
    var url = "http://la.cellactpro.com/http_req.asp?FROM=orbita&USER=orbita&PASSWORD=nfYT632jsE0&APP=LA&CMD=sendtextmt&SENDER=Orbita&SN=SMS&MSGID=123456&CONFMAIL=orbitasat@mail.ru&CONTENT=Test&TO=0532247808";
    var form = {
        TO: phone,
        CONTENT: text
    };
    var formData = querystring.stringify(form);
    request(
        {
            // uri: url+formData,
            uri: url,
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