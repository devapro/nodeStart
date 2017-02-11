/**
 * Logs (from log component)
 */
const mongoose = require('../components/mongoose').mongoose;

const Schema = mongoose.Schema;

// Schemas
const Log = new Schema({
    message: { type: String },
    file: { type: String , trim: true},
    modified: { type: Date, default: Date.now },
    type: { type: String , trim: true}
});


const LogModel = mongoose.model('Log', Log);

module.exports.LogModel = LogModel;