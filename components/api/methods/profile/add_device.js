'use strict';

/**
 * Add device id
 */
const config = require('../../../config');
const log = require('../../../log')(module);
const UserModel = require('../../../../models/UserModel').UserModel;

module.exports = function () {

    return function(req, res, next) {

        req.checkBody('push_token', 'Invalid Device Token').isLength({ min: 50, max: 400 });
        var mappedErrors = req.validationErrors(true);
        if(mappedErrors){
            console.log(mappedErrors);
            for (var er in mappedErrors) {
                var errors = {};
                errors[mappedErrors[er].param] = mappedErrors[er].msg;
                res.apiResponse.setErrors(errors);
            }
            res.apiResponse.setStatus(0);
            res.apiResponse.setMessage("Validation error");
            return res.apiResponse.send();
        }

        var is_new_token = false;
        var new_data = {};
        if(req.user.push_devices.indexOf(req.body.push_token) < 0){
            is_new_token = true;
            new_data.$push = {push_devices: req.body.push_token};
        }

        if(is_new_token){
            UserModel.findOneAndUpdate({_id: req.user._id}, new_data, function (err, doc) {
                if(err){
                    return res.addErrors(err);
                }
                // success save
                req.user = doc;
                res.apiResponse.setMessage("Save OK");
                return res.apiResponse.send();
            });
        } else {
            res.apiResponse.setMessage("Save OK");
            return res.apiResponse.send();
        }
    };

};