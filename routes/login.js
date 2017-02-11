/**
 * Login to admin panel
 */

'use strict';

const express = require('express');
const router = express.Router();
const log = require('../components/log')(module);
const config = require('../components/config');

const SendEmail = require('../components/service/email');
const SendSms = require('../components/service/sms');

const UserModel = require('../models/UserModel').UserModel;

const AjaxResponseObject = require('../components/AjaxResponseObject');

/**
 * check auth
 * if user is auth and has permission, redirect to admin panel
 * @param req
 * @param res
 * @param next
 */
function check_auth(req, res, next) {
    if (req.session.user != undefined && (req.session.user.role == UserModel.roles.manager || req.session.user.role == UserModel.roles.admin)) {
        return res.redirect('/admin/');
    } else {
        next();
    }
}

/**
 * Login page
 */
router.get('/login', check_auth, function(req, res, next) {
    return res.render('login/login');
});

/**
 * Submit login data
 */
router.post('/login', check_auth, function(req, res, next) {
    var response = new AjaxResponseObject();
    req.check('login', 'Login must be between 4 and 10 chars').isLength({min:4, max:50});
    req.check('password', 'Password must be between 4 and 10 chars').isLength({min:4, max:20});
    var mappedErrors = req.validationErrors(true);
    if(mappedErrors){
        log.error(mappedErrors);
        for (var er in mappedErrors) {
            response.addError(mappedErrors[er].msg);
        }
        res.statusCode = 400;
        return res.json(response.get());
    }

    UserModel.findByEmail(req.body.login, function(err, user){
        if(err || user == null){
            response.addError("Invalid login or password");
            res.statusCode = 400;
            return res.json(response.get());
        }
        log.info(user.toString());
        if(err || !user.authenticate(req.body.password)){
            response.addError("Invalid login or password");
            res.statusCode = 400;
            return res.json(response.get());
        }
        req.session.user = user;
        response.setData({"ok":"ok"});
        return res.json(response.get());
    });
});

/**
 * forgot page
 */
router.get('/forgot', check_auth, function(req, res, next) {
    return res.render('login/forgot');
});

/**
 * Submit forgot data
 */
router.post('/forgot', check_auth, function(req, res, next) {
    var response = new AjaxResponseObject();
    req.checkBody('login', 'Login must be between 4 and 10 chars').isLength({min:4, max:10});
    var mappedErrors = req.validationErrors(true);
    if(mappedErrors){
        log.error(mappedErrors);
        for (var er in mappedErrors) {
            response.addError(mappedErrors[er].msg);
        }
        res.statusCode = 400;
        return res.json(response.get());
    }

    UserModel.findByEmail(req.body.login, function(err, user){
        if(err || user == null){
            response.addError("Login not found");
            res.statusCode = 400;
            return res.json(response.get());
        }
        log.info(user.toString());
        
        // generate new password
        user.gen();

        user.save().then(function (doc) {
            if(user.email != undefined && user.email != ''){
                SendEmail.send(user.email, "Your password", "Password: " + user.password);
            }
            if(user.phone != undefined && user.phone != ''){
                SendSms.send(user.phone, "Your password", "Password: " + user.password);
            }
            response.setData({"ok":"ok"});
            return res.json(response.get());
        }).catch(function (err) {
            response.addError("Error send password");
            res.statusCode = 400;
            return res.json(response.get());
        });

    });
});


/**
 * log out
 */
router.get('/logout', function(req, res, next) {
    req.session.user = undefined;
    delete req.session.user;
    return res.redirect(config.get('urls:admin_login'));
});

module.exports = router;