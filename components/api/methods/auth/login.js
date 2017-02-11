'use strict';

/**
 * Get user profile
 */
var config = require('../../../config');
var log = require('../../../log')(module);
const UserModel = require('../../../../models/UserModel').UserModel;

module.exports = function () {

    return function(req, res, next) {

        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('password', 'Invalid password').isLength({min:4, max:10});
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

        UserModel.findOne({email: req.body.email}).then(function (user) {
            if (user == null) {
                res.apiResponse.setStatus(0);
                res.apiResponse.setMessage("Такой пользователь не найден");
                res.apiResponse.setError('email', 'Такой пользователь не найден');
                return res.apiResponse.send();
            }

            if(!user.authenticate(req.body.password)){
                res.apiResponse.setMessage("Не верный пароль");
                res.apiResponse.setError('password', "Не верный пароль");
                res.apiResponse.setStatus(0);
                return res.apiResponse.send();
            }
            // check user status
            if(user.status != UserModel.statuses.Active){
                res.apiResponse.setMessage("Пользователь не активен");
                res.apiResponse.setError('login', "Пользоватль не активен");
                res.apiResponse.setStatus(0);
                return res.apiResponse.send();
            }

            res.apiResponse.setMessage("Auth OK");
            res.apiResponse.setData({
                token: user.token,
                email: user.email
            });
            return res.apiResponse.send();
        }).catch(function (err) {
            return res.addErrors(err);
        });
    };

};