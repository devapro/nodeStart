/**
 * Override res.send write to log
 */

'use strict';

const config = require('../config');

const LogApiModel = require('../../models/LogApiModel').LogApiModel;

exports = module.exports = function () {

    return function(req, res, next) {

        console.log('API Time:', Date.now());

        if(config.get("sys:enable_log_api")){
            var data = {};
            // save incoming params
            data.params = JSON.stringify(req.params);
            var body = JSON.stringify(req.body);
            if(body && body.length > 2000){
                data.body = body.substring(0, 2000);
            } else {
                data.body = body;
            }
            data.headers = JSON.stringify(req.headers);
            data.rawHeaders = JSON.stringify(req.rawHeaders);
            data.url = req.url;
            data.method = req.method;
            data.query = JSON.stringify(req.query);

            var send = res.send;
            res.send = function(options) {
                var self = this,
                    options = options || {};

                // save result
                //console.log(options);
                data.response = JSON.stringify(options);
                var model = new LogApiModel(data);
                model.save(function (err, doc) {
                    if(err){
                        console.log("Error write log for api");
                        console.log(err);
                    }
                });

                send.call(self, options);
            };

            next();
        } else {
            next();
        }
    };

};