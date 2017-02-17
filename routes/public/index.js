'use strict';

const express = require('express');
const router = express.Router();
const log = require('../../components/log')(module);
const config = require('../../components/config');

router.get('/', function(req, res, next) {
    return res.render('public/index');
});

module.exports = router;