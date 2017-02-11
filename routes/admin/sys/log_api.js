'use strict';

const express = require('express');
const router = express.Router();
const async = require('async');
const escapeStringRegexp = require('escape-string-regexp');

const config = require('../../../components/config');
const LogApiModel = require('../../../models/LogApiModel').LogApiModel;

const AjaxResponseObject = require('../../../components/AjaxResponseObject');

/* listing. */
router.get('/', function (req, res, next) {
    res.render('layouts/admin/list', { title: 'Log Api', dataUrl: "/admin/sys/api/list/" });
});

/**
 * Get data for listing
 */
router.get('/list/:perPage/:page', function (req, res, next) {
    var model = LogApiModel;
    var response = new AjaxResponseObject();
    // fields
    var json = {};
    json.header = {
        "url":"Url",
        "method":"Method",
        "date_exec":"Date"
    };
    json.urls = {
        "view": "/admin/sys/api/view/",
        "update": false,
        "delete": "/admin/sys/api/delete/",
        "delete_all" : "/admin/sys/api/delete_all/"
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
    LogApiModel.findById(req.params.id, function (err, doc) {
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
            url: 'Url',
            method: 'Method',
            params: 'Params',
            body: 'Body',
            query: 'Query',
            headers: 'Headers',
            rawHeaders: 'Raw Headers',
            path: 'Path',
            status: 'Status',
            date_exec: 'Date',
            response: 'Response'
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
    LogApiModel.findByIdAndRemove(req.params.id, function (err) {
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
    LogApiModel.remove(function (err) {
        if(err ){
            return res.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }
        return res.json({});
    });
});

module.exports = router;