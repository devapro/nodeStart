'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const log = require('./components/log')(module);
const config = require('./components/config');
const mongoose = require('./components/mongoose').mongoose;
const LogErrorModel = require('./models/LogErrorModel').LogErrorModel;
const UserModel = require('./models/UserModel').UserModel;

const app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(require('express-domain-middleware'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const expressValidator = require('express-validator');
const customValidators = require('./components/validator');
app.use(expressValidator({
    customValidators: customValidators
}));

// session start
app.use(session({
    secret: config.get('secret'),
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false},
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// i18n

const i18n=require("./components/i18n");
app.use(i18n({
    defaultLang: 'ru',
    siteLangs: ['ru'],
    translationsPath: path.join(__dirname, 'i18n')
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use(function (req, res, next) {
    res.render2 = res.render;

    res.render = function (view, data, fn) {

        if(data == undefined){
            data = {};
        }

        if(!data.title){
            data.title = config.get('title');
        }
        if(!data.css){
            data.css = [];
        }
        if(!data.js){
            data.js = [];
        }

        data.base_url = config.get('base_url');
        data.sys_current_url = req.baseUrl;

        data.sys_user = req.session.user != undefined ? new UserModel(req.session.user) : null;

        data.messages = req.session.messages ? req.session.messages : {error: [], info: []};
        req.session.messages = {error: false, info: false};

        res.render2(view, data, fn);
    };

    next();
});

const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log("404 " + req.path);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);

        console.log(err);
        var emodel = new LogErrorModel({
            message: err.message,
            status: err.status,
            stack: err.stack,
            params: JSON.stringify(req.params),
            baseUrl: req.baseUrl,
            path: req.path,
            query: JSON.stringify(req.query),
            route: req.route ? req.route.path : ""
        });
        emodel.save(function (err) {
            if(err){
                console.log("Error save log " + err);
            }
        });

        if(res.apiResponse){
            res.apiResponse.setError("server", "Server error");
            res.apiResponse.send();
        } else {
            res.render('error', {
                message: err.message,
                error: {}
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    var emodel = new LogErrorModel({
        message: err.message,
        status: err.status,
        stack: err.stack,
        params: JSON.stringify(req.params),
        baseUrl: req.baseUrl,
        path: req.path,
        query: JSON.stringify(req.query),
        route: req.route ? req.route.path : ""
    });
    emodel.save(function (err) {
        if(err){
            console.log("Error save log " + err);
        }
    });

    if(res.apiResponse){
        res.apiResponse.setError("server", "Server error");
        res.apiResponse.send();
    } else {
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});


if(process.env.NODE_ENV == 'production'){
    /**
     * Init reload post
     */
    const init = require('./components/cron/init');

}

module.exports = app;
