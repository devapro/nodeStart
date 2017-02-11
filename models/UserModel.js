/**
 * User model
 */

'use strict';

const md5 = require('blueimp-md5');
const log = require('../components/log')(module);
const moment = require('moment');
const mongoose = require('../components/mongoose').mongoose;
const config = require('../components/config');

const Schema = mongoose.Schema;

// user status
var statuses = {
    Active: 'active',
    Review: 'review',
    Deleted: 'deleted'
};

// user role
var roles = {
    dev: 'dev',
    admin: 'admin',
    manager: 'manager',
    user: 'user'
};

// Schemas
var User = new Schema({
    // email
    email: { type: String, index: true, unique: [true, 'This email already exists'], sparse : true},
    // name
    name: { type: String , trim: true},
    // phone
    phone: { type: String , trim: true},
    // password
    password: { type: String, required: [true, 'Password is require'] },
    // token
    token: { type: String, trim: true, default: null },
    // status
    status: { type: String, default: statuses.Review, enum: [statuses.Active, statuses.Review, statuses.Deleted] },
    // role
    role: { type: String, default: roles.user , enum: [roles.admin, roles.manager, roles.user, roles.dev]},
    // date created
    created_at: { type: Date, default: Date.now },
    // date updated
    updated_at: { type: Date, default: Date.now },
    // push id
    push_device_ios: [
        { type: String, default: null}
    ],
    push_device_android: [
        { type: String, default: null}
    ],
    api_key: { type: String, default: "---" }
});

// behaviors
User.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

/**
 * Find user by email
 */
User.static('findByEmail', function (email, callback) {
    return this.findOne({ email: email }, callback);
});

/**
 * Find by id
 */
User.static('findById', function (id, callback) {
    return this.findOne({ _id: mongoose.Types.ObjectId(id)}, callback);
});

/**
 * Find by token
 */
User.static('findByToken', function (token, callback) {
    return this.findOne({ token: new RegExp('.*'+token+'.*', "i") }, callback);
});

User.methods.authenticate = function authenticate(password) {
    return md5(password) === this.password;
};

/**
 * Generate token
 * @returns {*}
 */
User.methods.genToken = function () {
    this.token = md5(this.password + this.email + (Math.random() * (999999 - 111111)));
    return this.token;
};

/**
 * Generate api key
 * @returns {*}
 */
User.methods.genApiKey = function () {
    this.api_key = md5(this.password + this.email + (Math.random() * (999999 - 111111)));
    return this.token;
};

/**
 * Generate password
 * @returns {number}
 */
User.methods.gen = function () {
    var rand = 111111 + Math.random() * (999999 - 111111);
    this.password = Math.round(rand);
    this.token = this.genToken();
    return rand;
};

User.methods.setPassword = function (password) {
    this.password = md5(password);
};

/**
 * Check access for role or roles
 * @returns boolean
 */
User.methods.can = function (roles) {
    if(!Array.isArray(roles)){
        roles = [roles];
    }
    for(var i in roles){
        if(this.role == roles[i]){
            return true;
        }
    }
    return false
};

/**
 * For private api
 * @returns {{first_name: *, phone: *, password: *, token: *}}
 */
User.methods.getFields = function () {

    return {
        id: this._id,
        token: this.token,
        email: this.email != undefined ? this.email.toString() : "",
        role: this.role,
        api_key: this.api_key,
        name: this.name != undefined ? this.name.toString() : "",
        phone: this.phone != undefined ? this.phone.toString() : "",
        created_at: this.created_at,
        updated_at: this.updated_at
    };
};

var UserModel = mongoose.model('User', User);

UserModel.statuses = statuses;
UserModel.roles = roles;

module.exports.UserModel = UserModel;