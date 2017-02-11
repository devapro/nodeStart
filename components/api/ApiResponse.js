/**
 * Add api response object
 * @constructor
 */

'use strict';

const log = require('../log')(module);

var ApiResponse = function(){
    
    this._response = {
        status: 1,
        message: "",
        result:{
            error: [],
            data: {}
        }
    };
    
    this._error = [];
    
    this.getResponse = function () {
        return this._response;
    };
    
    this.setData = function (data) {
        this._response.result.data = data;
    };
    
    this.setError = function (key, error) {
        var err = {};
        err[key] = error;
        this.setErrors(err);
    };
    
    this.setErrors = function (errors) {
        for (var i in errors){
            this._error.push({code: i, message: errors[i]});
        }
    };
    
    this.setStatus = function (status) {
        this._response.status = status;
    };
    
    this.setMessage = function (message) {
        this._response.message = message;
    };
};

exports = module.exports = function () {

    return function(req, res, next) {

        res.apiResponse = new ApiResponse();

        res.apiResponse.send = function () {
            res.apiResponse._response.result.error = res.apiResponse._error;
            res.send(res.apiResponse.getResponse());
        };

        res.addErrors = function (err) {
            log.error(err);
            var errors = {};
            for (var er in err.errors) {
                errors[er] = err.errors[er].message;
            }
            res.apiResponse.setErrors(errors);
            res.apiResponse.setMessage("Db error");
            res.apiResponse.setStatus(0);
            return res.apiResponse.send();
        };

        try{
            var request = req.body;
            req.body = request.params;
            if(req.body == undefined || req.body == null){
                res.apiResponse.setMessage("Error parse request data ");
                res.apiResponse.setStatus(0);
                res.apiResponse.setError('data', "Error parse request data ");
                return res.apiResponse.send();
            }
        } catch (e){
            res.apiResponse.setMessage("Error parse request data " + e);
            res.apiResponse.setStatus(0);
            res.apiResponse.setError('data', "Error parse request data " + e);
            return res.apiResponse.send();
        }

        next();
    };

};