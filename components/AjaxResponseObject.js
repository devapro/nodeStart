/**
 * Object for ajax response
 */

'use strict';

const AjaxResponseObject = function () {
    var self = this;
    this._data = {};
    this._errors = [];

    this.addError = function (error) {
        if(error && error.toString){
            this._errors.push(error.toString());
        }
    };

    this.addErrors = function (errors) {
        if(errors && errors.forEach){
            errors.forEach(function (error, key, array) {
                self.addError(error);
            });
        }
    };

    this.setData = function (data) {
        this._data = data;
    };

    this.get = function () {
        return {
            data: this._data,
            errors: this._errors
        }
    }
};

module.exports = AjaxResponseObject;