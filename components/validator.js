/**
 * Custom validator
 */

'use strict';

const mongoose = require('mongoose');
const validator = {
    /**
     *
     * @param value
     * @returns {boolean}
     */
    isArray: function (value) {
        return Array.isArray(value);
    },

    /**
     *
     * @param param
     * @param num
     * @returns {boolean}
     */
    gte: function (param, num) {
        return param >= num;
    },

    /**
     *
     * @param text
     * @param options
     * @returns {boolean}
     */
    isLText: function (text, options) {
        if(!text){
            return false;
        }
        text = text.toString().replace(/\n\s*\n\s*\n/g, '\n\n');
        if(text == ""){
            return false;
        }

        if (text.match(/[^a-zA-Z0-9 àâäèéêëîïôœùûüÿçÀÂÄÈÉÊËÎÏÔŒÙÛÜŸÇ\-]/g)) {
            return false;
        }

        if(options && options.min){
            if(text.length < options.min){
                return false;
            }
        }
        if(options && options.max){
            if(text.length > options.max){
                return false;
            }
        }
        return true;
    },

    /**
     *
     * @param value
     * @returns {*|boolean}
     */
    isObjectId: function (value) {
        return mongoose.Types.ObjectId.isValid(value);
    }
};

module.exports = validator;