/**
 * Модель лога ошибок
 */
const log = require('../components/log')(module);
const mongoose = require('../components/mongoose').mongoose;

const Schema = mongoose.Schema;

// Schemas
const LogError = new Schema({
    message: { type: String , trim: true},
    params: { type: String , trim: true},
    baseUrl: { type: String , trim: true},
    path: { type: String , trim: true},
    status: { type: String , trim: true},
    query: { type: String , trim: true},
    route: { type: String , trim: true},
    modified: { type: Date, default: Date.now },
    stack: { type: String , trim: true}
});


const LogErrorModel = mongoose.model('LogError', LogError);


module.exports.LogErrorModel = LogErrorModel;