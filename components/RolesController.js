/**
 * Check user roles
 */

'use strict';

const UserModel = require('../models/UserModel').UserModel;

module.exports = function (roles) {
    return function(req, res, next) {
        if(roles.indexOf(req.session.user.role) >= 0)
            next();
        else{
            var err = new Error('Forbidden ...');
            err.status = 403;
            next(err);
        }
    }
};