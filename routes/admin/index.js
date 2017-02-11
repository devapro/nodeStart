const express = require('express');
const router = express.Router();
const UserModel = require('../../models/UserModel').UserModel;
const RolesController = require('../../components/RolesController');
const auth = require('../../components/auth');

// write to log
router.use(function(req, res, next) {
    console.log('Admin Time:', Date.now());
    next();
});

router.use( auth() );

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect("/admin/users");
});

const users = require('./users');
router.use('/users', RolesController([UserModel.roles.dev, UserModel.roles.admin]), users);

const sys = require('./sys');
router.use('/sys', RolesController([UserModel.roles.dev]), sys);


module.exports = router;
