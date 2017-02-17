/**
 * Main route
 */

'use strict';

const express = require('express');
const router = express.Router();
const log = require('../components/log')(module);

const login = require('../routes/login');
router.use('/admin', login);

const api = require('../routes/api/v1');
router.use('/api', api);

const admin = require('../routes/admin');
router.use('/admin', admin);

const index = require('../routes/public/index');
router.use('/', index);

module.exports = router;
