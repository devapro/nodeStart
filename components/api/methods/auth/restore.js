'use strict';

/**
 * User login
 */
const config = require('../../../config');
const log = require('../../../log')(module);
const SendEmail = require('../../../service/email');

const UserModel = require('../../../../models/UserModel').UserModel;

module.exports = function () {

    return function(req, res, next) {

        req.checkBody('email', 'Invalid email').isEmail();
        var mappedErrors = req.validationErrors(true);
        if(mappedErrors){
            console.log(mappedErrors);
            for (var er in mappedErrors) {
                var errors = {};
                errors[mappedErrors[er].param] = mappedErrors[er].msg;
                res.apiResponse.setErrors(errors);
            }
            res.apiResponse.setStatus(0);
            res.apiResponse.setMessage("Проверьте заполнение формы");
            return res.apiResponse.send();
        }

        UserModel.findOne({$or:[{ email:req.body.email }]}, function (err, user) {
            if(err || user == null){
                res.apiResponse.setMessage("Такой пользователь не найден");
                res.apiResponse.setError('email', "Такой пользователь не найден");
                res.apiResponse.setStatus(0);
                return res.apiResponse.send();
            }

            user.gen();

            user.save().then(function (user) {
                if(user.email != undefined && user.email != ''){
                    SendEmail.sendTemplate(user, "Restore password", {}, 'forgot_password');
                    res.apiResponse.setMessage("Send OK");
                    return res.apiResponse.send();
                } else {
                    res.apiResponse.setMessage("Не удалось отправить пароль");
                    res.apiResponse.setError('email', "Email not found");
                    res.apiResponse.setStatus(0);
                    return res.apiResponse.send();
                }
            }).catch(function (err) {
                return res.addErrors(err);
            });
        });
    };

};