/**
 * Application database connection
 */

'use strict';

const config      = require('./config');
const mongoose    = require('mongoose');
const winston = require('winston');

const log = new winston.Logger({
    transports : [
        new winston.transports.Console({
            colorize:   true,
            level:      'debug',
            label:      'mongoose'
        })
    ]
});

mongoose.connect(config.get('mongoose:uri'));
const db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

mongoose.Promise = global.Promise;

module.exports.mongoose = mongoose;

