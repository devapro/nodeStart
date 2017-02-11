'use strict';

const express = require('express');
const router = express.Router();
const sanitize = require("mongo-sanitize");

const logger = require('../../../components/api/logger');
const ApiResponse = require('../../../components/api/ApiResponse');



function cleanBody(req, res, next) {
    req.body = sanitize(req.body);
    next();
}

// write to log
router.use(logger());
// set api Response object
router.use(ApiResponse());

router.get('/', function (req, res, next) {
    res.apiResponse.setData({api: "v1"});
    res.apiResponse.send();
});
router.post('/', function (req, res, next) {
    res.apiResponse.setData({api: "v1"});
    res.apiResponse.send();
});


const auth = require('./auth');
router.use('/', auth);

const profile = require('./profile');
router.use('/', cleanBody, profile);

module.exports = router;