'use strict';

/**
 * Set password
 */
const config = require('../../../config');
const log = require('../../../log')(module);
const UserModel = require('../../../../models/UserModel').UserModel;

module.exports = function () {

    return function(req, res, next) {

        req.checkBody('password', 'Invalid pin name').isLength({min:4, max:20});

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

        //find user
        UserModel.findOne({_id: req.user._id}).then(function (user) {
           if(user == null){
               res.apiResponse.setStatus(0);
               res.apiResponse.setMessage("Invalid Entry");
               res.apiResponse.setError('email', 'Invalid Entry');
               return res.apiResponse.send();
           }

            user.setPassword(req.body.password);
            // set password
            UserModel.findOneAndUpdate({_id: user._id}, {password: user.password}, {new: true}, function (err, doc) {
                if(err){
                    return res.addErrors(err);
                }
                res.apiResponse.setData(user.getFields());
                return res.apiResponse.send();
            });

        }).catch(function (err) {
            return res.addErrors(err);
        });

    };

};