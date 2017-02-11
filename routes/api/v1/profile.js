'use strict';

var express = require('express');
var router = express.Router();
var mime = require('mime-types');


var config = require('../../../components/config');
var log = require('../../../components/log')(module);
var api_auth = require('../../../components/api/api_auth');

var UserModel = require('../../../models/UserModel').UserModel;

// check auth
router.use(api_auth());

/**
 * push
 */
var add_device = require('../../../components/api/methods/profile/add_device');
router.post('/add_device', add_device());

/**
 * remove push
 */
var remove_device = require('../../../components/api/methods/profile/remove_device');
router.post('/remove_device', remove_device());

/**
 * push (main device)
 */
var save_push_token = require('../../../components/api/methods/profile/save_push_token');
router.post('/save_push_token', save_push_token());

/**
 * remove push (main device)
 */
var remove_push_token = require('../../../components/api/methods/profile/remove_push_token');
router.post('/remove_push_token', remove_push_token());

/**
 * set password
 */
var set_password = require('../../../components/api/methods/profile/set_password');
router.post('/set_password', set_password());


module.exports = router;