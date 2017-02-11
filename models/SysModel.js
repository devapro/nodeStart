'use strict';

/**
 * SysModel
 */
const mongoose = require('../components/mongoose').mongoose;

const Schema = mongoose.Schema;

// Schemas
const Sys = new Schema({
    message: { type: String },
    file: { type: String , trim: true},
    modified: { type: Date, default: Date.now },
    type: { type: String , trim: true}
});


const SysModel = mongoose.model('Sys', Sys);

module.exports.SysModel = SysModel;