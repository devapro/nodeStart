var express = require('express');
var router = express.Router();

var log_errors = require('./log_errors');
var log_logs = require('./log_logs');
var log_api = require('./log_api');
var log_sys = require('./log_sys');

router.use('/errors', log_errors);
router.use('/logs', log_logs);
router.use('/api', log_api);
router.use('/sys', log_sys);

module.exports = router;