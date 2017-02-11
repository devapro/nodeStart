/**
 * Amazon S3 client
 */

'use strict';

const config  = require('../config');
const s3 = require('s3');
const winston = require('winston');

const log = new winston.Logger({
    transports : [
        new winston.transports.Console({
            colorize:   true,
            level:      'debug',
            label:      's3'
        })
    ]
});

const amazonS3 = function () {
    const client = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 500, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 5728640, // this is the default (5 MB)
        s3Options: {
            accessKeyId: config.get("s3:accessKeyId"),
            secretAccessKey: config.get("s3:secretAccessKey"),
            region: config.get("s3:region"),
            endpoint: config.get("s3:endpoint")
        }
    });


    this.randomInteger = function(min, max) {
        var rand = min + Math.random() * (max - min)
        rand = Math.round(rand);
        return rand;
    };

    this.upload = function (params, cb) {
        var uploader = client.uploadFile(params);
        uploader.on('error', function(err) {
            log.error("unable to upload:", err.stack);
            cb(err);
        });
        uploader.on('progress', function() {
            log.debug("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
        });
        uploader.on('end', function() {
            log.debug("done uploading");
            cb();
        });
    };

    this.deleteFiles = function(bucketName, objects, callback){

        if(!objects.forEach){
            objects = [objects];
        }

        var params = {Bucket: bucketName};
        params.Delete = {Objects: []};

        objects.forEach(function(obj) {
            params.Delete.Objects.push({Key: obj});
        });

        client.deleteObjects(params, function(err) {
            if (err) return callback(err);
            callback();
        });
    };

    this.getPublicUrlHttp = function (bucketName, key) {
        return s3.getPublicUrlHttp(bucketName, key);
    };
};

module.exports = amazonS3;

