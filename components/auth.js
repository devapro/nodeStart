/**
 * Authentication on admin panel
 */

'use strict';

const UserModel = require('../models/UserModel').UserModel;
const config = require('./config');

exports = module.exports = function () {

    return function(req, res, next) {

        if (req.session.user != undefined) {
            var user = new UserModel(req.session.user);
            console.log(user.role);
            if(user.can([UserModel.roles.manager, UserModel.roles.admin, UserModel.roles.dev])){
                return next();
            }
        }
        return res.redirect(config.get('urls:admin_login'));

    };
};