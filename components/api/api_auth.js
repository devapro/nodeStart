/**
 * Auth for api
 */
var UserModel = require('../../models/UserModel').UserModel;

exports = module.exports = function () {

    return function(req, res, next) {
        UserModel.findByToken(req.header("authorization"), function (err, user) {
            if(err || user == null || !req.header("authorization") || req.header("authorization") == ""){
                res.apiResponse.setMessage("Invalid token");
                res.apiResponse.setStatus(403);
                res.apiResponse.setError('token', "Invalid token");
                return res.apiResponse.send();
            } else {
                req.user = user;
                next();
            }
        });
    };

};