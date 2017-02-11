'use strict';

var express = require('express');
var moment = require('moment');
var router = express.Router();

var config = require('../../../components/config');
var log = require('../../../components/log')(module);

var UserModel = require('../../../models/UserModel').UserModel;

/**
 * Authorization
 */
var login = require('../../../components/api/methods/auth/login');
router.post('/login', login());

/**
 * Restore password
 */
var restore = require('../../../components/api/methods/auth/restore');
router.post('/restore', restore());

/**
 * Register
 */
var register = require('../../../components/api/methods/auth/register');
router.post('/register', register());


module.exports = router;