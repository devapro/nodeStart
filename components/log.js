/**
 * Application log
 */

'use strict';

const winston = require('winston');
const LogModel = require('../models/LogModel').LogModel;

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/'); //file name when created message

    var logger = new winston.Logger({
        transports : [
            new winston.transports.Console({
                colorize:   true,
                level:      'debug',
                label:      path
            })
        ]
    });

    logger.on('logged', function (level, msg, meta) {
        // [msg] and [meta] have now been logged at [level] to [transport]

        // new LogModel({
        //     message: JSON.stringify(meta),
        //     type: level,
        //     file: path
        // }).save(function (err, doc) {
        //     if(err){
        //         console.log("Log save error" + err);
        //     }
        // });
    });

    return logger;
}

module.exports = getLogger;