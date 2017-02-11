/**
 * Image resize
 */

'use strict';

const log = require('./log')(module);
const gm = require('gm').subClass({imageMagick: true});
const async = require('async');

const Resize = {};

Resize.resize = function(err, success, file_orig, file_resize, file_thumb){

    log.info(file_orig);

    var error = false;
    async.parallel([
        function(callback){
            gm(file_orig)
                .resize(500, 500)
                .noProfile()
                .crop(500, 500, 0, 0)
                .write(file_resize, function (err) {
                    if (err) {
                        error = err;
                        log.error("Error resize full");
                        log.error(err);
                    } else {
                        log.info("Success resize full");
                    }
                    callback();
                });
        },
        function(callback){
            gm(file_orig)
                .resize(300, 300)
                .noProfile()
                .crop(300, 300, 0, 0)
                .write(file_thumb, function (err) {
                    if (err) {
                        error = err;
                        log.error("Error resize thumb");
                        log.error(err);
                    } else {
                        log.info("Success resize thumb");
                    }
                    callback();
                });
        }
    ], function(){
        if(error){
            return err(error);
        }
        success();
    });
};

module.exports = Resize;