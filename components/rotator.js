/**
 * Image rotator
 */

'use strict';

const log = require('./log')(module);
const gm = require('gm').subClass({imageMagick: true});
const async = require('async');
const fs = require('fs');
const request = require('request');
const config = require('./config');

const Rotator = {};

/**
 * Rotate image
 * @param color
 * @param deg
 * @param key
 * @param cb
 */
Rotator._rotate = function (color, deg, key, cb) {
    async.parallel([
        function (cb) {
            gm(config.get('files:selfie_full') + "/" + key)
                .rotate(color, deg)
                .write(config.get('files:selfie_full') + "/" + key, function (err) {
                    if (err) {
                        error = err;
                        log.error("Error rotate full");
                        log.error(err);
                    } else {
                        log.info("Success rotate full");
                    }
                    cb();
                });
        },
        function (cb) {
            gm(config.get('files:selfie_thumb') + "/" + key)
                .rotate(color, deg)
                .write(config.get('files:selfie_thumb') + "/" + key, function (err) {
                    if (err) {
                        error = err;
                        log.error("Error rotate thumb");
                        log.error(err);
                    } else {
                        log.info("Success rotate thumb");
                    }
                    cb();
                });
        }
    ], function (err) {
        cb(err);
    });
};

/**
 * Main function
 * @param color
 * @param deg
 * @param key
 * @param cb
 */
Rotator.process = function (color, deg, key, cb) {
    Rotator._rotate(color, deg, key, cb);
};

module.exports = Rotator;