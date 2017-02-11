/**
 * Image rotator (Amazon S3)
 */

'use strict';

const log = require('./log')(module);
const gm = require('gm').subClass({imageMagick: true});
const async = require('async');
const fs = require('fs');
const request = require('request');

const fileHelper = require('./FileHelper');
const config = require('./config');
const amazonS3 = require('./service/amazonS3');
const amazon = new amazonS3();

var Rotator = {};

/**
 * Download from S3
 * @param key
 * @param cb
 */
Rotator._downloadImage = function (key, cb) {
    var image = {
        full: amazon.getPublicUrlHttp(config.get("s3:fullimg"), key),
        preview: amazon.getPublicUrlHttp(config.get("s3:thumbimg"), key)
    };

    async.parallel([
        function (cb) {
            request.head(image.full, function(err, res, body){
                request(image.full).pipe(fs.createWriteStream(config.get('files:user_avatar_full') + "/" + key)).on('close', cb);
            });
        },
        function (cb) {
            request.head(image.preview, function(err, res, body){
                request(image.preview).pipe(fs.createWriteStream(config.get('files:user_avatar_thumb') + "/" + key)).on('close', cb);
            });
        }
    ], function (err) {
        cb(err);
    });

};

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
            gm(config.get('files:user_avatar_full') + "/" + key)
                .rotate(color, deg)
                .write(config.get('files:user_avatar_full') + "/" + key, function (err) {
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
            gm(config.get('files:user_avatar_thumb') + "/" + key)
                .rotate(color, deg)
                .write(config.get('files:user_avatar_thumb') + "/" + key, function (err) {
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
 * Upload to S3
 * @param key
 * @param cb
 */
Rotator._uploadImage = function (key, cb) {

    async.parallel([
        function (cb) {
            amazon.deleteFiles(config.get("s3:thumbimg"), key, function (err) {
                cb(err);
            });
        },
        function (cb) {
            amazon.deleteFiles(config.get("s3:fullimg"), key, function (err) {
                cb(err);
            });
        }
    ], function (err) {

    });

    var params_full = {
        localFile: config.get('files:user_avatar_full') + "/" + key,
        s3Params: {
            Bucket: config.get("s3:fullimg"),
            Key: key
        }
    };

    var params_thumb = {
        localFile: config.get('files:user_avatar_thumb') + "/" + key,
        s3Params: {
            Bucket: config.get("s3:thumbimg"),
            Key: key
        }
    };

    async.parallel([
        function (cb) {
            amazon.upload(params_thumb, cb);
        },
        function (cb) {
            amazon.upload(params_full, cb);
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
    async.waterfall([
        function (cb) {
            Rotator._downloadImage(key, cb);
        },
        function (cb) {
            Rotator._rotate(color, deg, key, cb);
        },
        function (cb) {
            Rotator._uploadImage(key, cb);
        }
    ], function (err) {
        cb(err);
        fileHelper.delete(config.get('files:user_avatar_full') + "/" + key);
        fileHelper.delete(config.get('files:user_avatar_thumb') + "/" + key);
    });
};

module.exports = Rotator;