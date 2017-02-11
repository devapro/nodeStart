/**
 * Модель лога api
 */
const log = require('../components/log')(module);
const mongoose = require('../components/mongoose').mongoose;

const Schema = mongoose.Schema;

// Schemas
const LogApi = new Schema({
    method: { type: String , trim: true},
    params: { type: String , trim: true},
    body: { type: String , trim: true},
    headers: { type: String , trim: true},
    url: { type: String , trim: true},
    query: { type: String , trim: true},
    rawHeaders: { type: String , trim: true},
    path: { type: String , trim: true},
    status: { type: String , trim: true},
    date_exec: { type: Date, default: Date.now },
    response: { type: String , trim: true}
});


const LogApiModel = mongoose.model('LogApi', LogApi);


module.exports.LogApiModel = LogApiModel;