'use strict';

/**
 * Register user
 */
const config = require('../../../config');
const log = require('../../../log')(module);
const UserModel = require('../../../../models/UserModel').UserModel;
const SendEmail = require('../../../service/email');

module.exports = function () {

    return function(req, res, next) {

        req.checkBody('email', 'Invalid email').isEmail();
        req.checkBody('phone', 'Проверьте правильность указанного телефона').isLength({min: 4, max: 16});
        req.checkBody('password', 'Invalid password').isLength({min:4, max:10});
        req.checkBody('name', 'Invalid name').isLength({min:2, max:100});
        var mappedErrors = req.validationErrors(true);
        if(mappedErrors) {
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

        UserModel.findOne({$or: [{email: req.body.email}, {phone: req.body.phone}]}).then(function (user) {
            if(user != null){
                res.apiResponse.setStatus(0);
                if(user.email == req.body.email){
                    res.apiResponse.setMessage("Такой email уже используется");
                    res.apiResponse.setError('email', 'Такой  email уже используется');
                }
                if(user.phone == req.body.phone){
                    res.apiResponse.setMessage("Такой телефон уже зарегистрирован");
                    res.apiResponse.setError('phone', 'Такой телефон уже зарегистрирован');
                }
                return res.apiResponse.send();
            }


            //detect reg ip
            var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
            ip = ip.split(':');
            ip = ip[ip.length - 1];
            log.info("Client IP: " + ip);

            user = new UserModel();
            user.email = req.body.email;
            user.phone = req.body.phone;

            var d = new Date();
            user.created_at = Math.floor(d.getTime()/1000);
            user.name = req.body.name;
            user.role = UserModel.roles.user;
            user.setPassword(req.body.password);
            user.status = UserModel.statuses.Active;
            user.genToken();

            // Save profile
            var save = function () {
                user.save(function (err, model) {

                    if (err) {
                        log.error(err);
                        return res.addErrors(err);
                    }

                    // send email
                    model.new_password = req.body.password;
                    SendEmail.sendTemplate(model, "Регистрация успешна", {}, 'success_register');

                    var notification_email = 'Зарегистрирован новый пользователь :' + model.email + " " + model.phone;
                    SendEmail.send(config.get("sys:admin_email"), "Регистрация нового пользователя", notification_email, notification_email);

                    // success save
                    res.apiResponse.setMessage("Register OK");
                    res.apiResponse.setData(user.getFields());
                    return res.apiResponse.send();
                });
            };

            save();

        }).catch(function (err) {
            return res.addErrors(err);
        });
    };

};