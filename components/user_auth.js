/**
 * Authentication user on account
 */

'use strict';

var UserModel = require('../models/UserModel').UserModel;
var config = require('./config');

exports = module.exports = function () {

    return function(req, res, next) {

        if (req.session.user != undefined) {
            var user = new UserModel(req.session.user);
            console.log(user.role);
            return next();
        } else {
            return res.redirect("/");
        }

    };
};