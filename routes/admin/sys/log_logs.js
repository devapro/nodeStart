'use strict';

const express = require('express');
const router = express.Router();
const async = require('async');
const escapeStringRegexp = require('escape-string-regexp');

const config = require('../../../components/config');
const LogModel = require('../../../models/LogModel').LogModel;

const AjaxResponseObject = require('../../../components/AjaxResponseObject');

/* listing. */
router.get('/', function (req, res, next) {
    res.render('layouts/admin/list', { dataUrl: "/admin/sys/logs/list/" });
});

/**
 * Get data for listing
 */
router.get('/list/:perPage/:page', function (req, res, next) {
    var model = LogModel;
    var response = new AjaxResponseObject();
    // fields
    var json = {};
    json.header = {
        "message":"Message",
        "file":"File",
        "modified":"Date",
        "type":"Type"
    };
    json.urls = {
        "view": "/admin/sys/logs/view/",
        "update": false,
        "delete": "/admin/sys/logs/delete/",
        "delete_all" : "/admin/sys/logs/delete_all/"
    };
    json.data = [];

    // sort
    var sort = {};
    if(req.query.sortKey){
        sort[req.query.sortKey] = req.query.reverse;
    } else {
        sort = {created_at: -1};
    }

    // search
    var filter = {};
    var search = "";
    if(req.query.q != undefined && req.query.q != ""){
        search = escapeStringRegexp(req.query.q);
        filter = {$or:[
            {body: new RegExp('.*'+search+'.*', "i")},
            {url: new RegExp('.*'+search+'.*', "i")},
            {response: new RegExp('.*'+search+'.*', "i")}
        ]};
    }

    // paging
    var skip = 0;
    var limit = 10;
    if(req.params.page && req.params.perPage){
        req.params.page = req.params.page-1;
        skip = req.params.page*req.params.perPage;
        limit = req.params.perPage;
    }

    model
        .count(filter)
        .then(function (total_count) {
            json.total_count = total_count;
            model
                .find(filter)
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .sort(sort)
                .then(function (items) {
                    for(var i = 0; i < items.length; i ++){
                        json.data.push(items[i]);
                    }
                    response.setData(json);
                    return res.json(response.get());
                }).catch(function (err) {
                    response.addError(err.message);
                    res.statusCode = 500;
                    return res.json(response.get());
                });
        }).catch(function (err) {
            response.addError(err.message);
            res.statusCode = 500;
            return res.json(response.get());
        });
});

/**
 * View item
 */
router.get('/view/:id', function (req, res, next) {
    var response = new AjaxResponseObject();
    LogModel.findById(req.params.id, function (err, doc) {
        if(err){
            log.error(err);
            res.statusCode = 500;
            response.addError(err.message);
            return res.json(response.get());
        }
        if(doc == null){
            log.error(err);
            res.statusCode = 404;
            response.addError("Item not found");
            return res.json(response.get());
        }
        var json = {};
        json.names = {
            message:"Message",
            file:"File",
            modified:"Date",
            type:"Type"
        };
        json.model = doc;

        response.setData(json);
        return res.json(response.get());
    });
});

/**
 * Delete item
 */
router.get('/delete/:id', function (req, res, next) {
    LogModel.findByIdAndRemove(req.params.id, function (err) {
        if(err ){
            return res.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }
        return res.json({});
    });
});

/**
 * Delete all
 */
router.get('/delete_all', function (req, res, next) {
    LogModel.remove(function (err) {
        if(err ){
            return res.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }
        return res.json({});
    });
});

module.exports = router;