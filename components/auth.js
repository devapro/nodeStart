/**
 * Authentication on admin panel
 */

'use strict';

const UserModel = require('../models/UserModel').UserModel;
const config = require('./config');

exports = module.exports = function () {

    return function(req, res, next) {

        if (req.session.user != undefined) {
            UserModel
                .findOne({_id: req.session.user._id})
                .then(function (us) {
                    if(
                        us.can([UserModel.roles.manager, UserModel.roles.admin, UserModel.roles.dev]) &&
                        us.status == UserModel.statuses.Active
                    ){
                        return next();
                    } else {
                        return res.redirect(config.get('urls:admin_login'));
                    }
                })
                .catch(function (err) {
                    return res.redirect(config.get('urls:admin_login'));
                });
        } else {
            return res.redirect(config.get('urls:admin_login'));
        }
    };
};