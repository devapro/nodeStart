/**
 * List users
 */

'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../components/config');
const fileHelper = require('../../components/FileHelper');
const log = require('../../components/log')(module);
const escapeStringRegexp = require('escape-string-regexp');

const UserModel = require('../../models/UserModel').UserModel;

const AjaxResponseObject = require('../../components/AjaxResponseObject');

/* listing. */
router.get('/', function (req, res, next) {
    res.render('admin/users/list', {
        title: "Users",
        dataUrl: "/admin/users/list/",
        js: ["/js/admin/users/users.js"]
    });
});

/**
 * Get data for listing
 */
router.get('/list/:perPage/:page', function (req, res, next) {
    var model = UserModel;
    var response = new AjaxResponseObject();
    // fields
    var json = {};
    json.header = {
        "name":"Name",
        "email":"Email",
        "phone":"Phone",
        "role":"Role",
        "status":"Status"
    };
    json.urls = {
        "create": "/admin/users/create/",
        "view": "/admin/users/view/",
        "update": "/admin/users/update/",
        "delete": "/admin/users/delete/"
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
            {name: new RegExp('.*'+search+'.*', "i")},
            {phone: new RegExp('.*'+search+'.*', "i")},
            {email: new RegExp('.*'+search+'.*', "i")}
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
    UserModel.findById(req.params.id, function (err, doc) {
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
            email: 'Email',
            name: 'Name',
            phone: 'Phone',
            role: 'Role',
            status: 'Status',
            created_at: 'Register at',
            updated_at: 'Updated at'
        };
        json.model = doc.getFields();
        response.setData(json);
        return res.json(response.get());
    });
});

/**
 * Delete item
 */
router.get('/delete/:id', function (req, res, next) {
    var user_id = req.params.id;

    UserModel.findOne({_id: user_id}).then(function (model) {
        UserModel.findByIdAndRemove(req.params.id, function (err) {
            if(err ){
                return res.status(404)        // HTTP status 404: NotFound
                    .send('Not found');
            }

            // delete temp files
            fileHelper.delete(config.get('files:temp_dir') + "/" + model.avatar);
            fileHelper.delete(config.get('files:user_avatar_full') + "/" + model.avatar);
            fileHelper.delete(config.get('files:user_avatar_thumb') + "/" + model.avatar);

            return res.json({ok: "ok"});
        });
    }).catch(function (err) {
        log.error(err);
        res.statusCode = 500;
        return res.json(err);
    });

});



/**
 * Form
 * @param req
 * @param res
 * @param doc
 * @param err
 */
var renderForm = function (req, res, doc, errors) {
    var response = new AjaxResponseObject();
    if (errors) {
        log.error(errors);
        if(!errors.forEach){
            errors = [errors];
        }
        errors.forEach(function (error, key, array) {
            response.addError(error);
        });
        res.statusCode = 500;
        return res.json(response.get());
    }
    doc.avatar = doc.avatar ? config.get("urls:url_avatar_thumb") + doc.avatar : false;
    var json = {
        model: doc,
        lists: {
            roles: UserModel.roles,
            statuses: UserModel.statuses
        },
        meta:{
        }
    };
    response.setData(json);
    return res.json(response.get());
};

/**
 * Create form
 */
router.get('/create', function (req, res, next) {
    var model = new UserModel();
    return renderForm(req, res, model);
});

/**
 * Edit form
 */
router.get('/update/:id', function (req, res, next) {
    UserModel.findById(req.params.id, function (err, doc) {
        if (doc == null) {
            return renderForm(req, res, null, ["Item not found"]);
        }
        if (err) {
            return renderForm(req, res, doc, [err.message]);
        }
        return renderForm(req, res, doc);
    });
});

/**
 * Save
 * @param req
 * @param res
 * @param model
 */
var saveModel = function (req, res, model) {
    model.save(function (error, user) {
        if (error != undefined && error) {
            log.error("Error save " + error);
            var errors = [];
            for (var er in error.errors) {
                errors.push(error.errors[er].message.toString());
                log.error(error.errors[er].message);
            }
            return renderForm(req, res, model, errors);
        }
        return renderForm(req, res, model);
    });
};

router.post('/create', function (req, res, next) {
    if(req.body.name ){
        req.body.name = req.body.name.trim();
    }
    if(req.body.role ){
        req.body.role = req.body.role.trim();
    }
    if(req.body.email ){
        req.body.email = req.body.email.trim();
    }
    if(req.body.new_password ){
        req.body.new_password = req.body.new_password.trim();
    }
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('role', 'Role is required').notEmpty();
    req.checkBody('new_password', 'Password is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail();

    var mappedErrors = req.validationErrors(true);
    if(mappedErrors){
        var errors = [];
        for (var er in mappedErrors) {
            errors.push(mappedErrors[er].msg);

        }
        return renderForm(req, res, null, errors);
    }

    var doc = new UserModel(req.body);
    doc.genToken();
    doc.setPassword(req.body.new_password);
    var d = new Date();
    doc.created_at = Math.floor(d.getTime()/1000);

    UserModel.findOne({$or:[{email: req.body.email}], _id:{$ne: doc._id}}, function (err, user) {
        if(err){
            log.error(err);
        }
        if(user != null){
            var errors = [];
            if(user.email == req.body.email){
                errors.push("Email already used");
            }
            return renderForm(req, res, doc, errors);
        } else {
            saveModel(req, res, doc);
        }
    });
});

router.post('/update/:id', function (req, res, next) {
    UserModel.findById(req.params.id, function (err, doc) {
        if (err) {
            res.statusCode = 403;
            return res.json(err);
        }

        if(req.body.name ){
            req.body.name = req.body.name.trim();
        }
        if(req.body.role ){
            req.body.role = req.body.role.trim();
        }
        if(req.body.email ){
            req.body.email = req.body.email.trim();
        }
        if(req.body.new_password ){
            req.body.new_password = req.body.new_password.trim();
        }
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('role', 'Role is required').notEmpty();
        req.checkBody('email', 'Email is required').isEmail();


        var mappedErrors = req.validationErrors(true);
        if(mappedErrors){
            var errors = [];
            for (var er in mappedErrors) {
                errors.push(mappedErrors[er].msg);

            }
            return renderForm(req, res, null, errors);
        }

        doc.name = req.body.name;
        doc.status = req.body.status;
        doc.role = req.body.role;
        doc.phone = req.body.phone;

        if(req.body.location){
            doc.location = req.body.location;
        }

        if(req.body.email && req.body.email != ""){
            if(doc.email != req.body.email){
                doc.genToken();
            }
            doc.email = req.body.email;
        }

        UserModel.findOne({$or:[{email: req.body.email}], _id:{$ne: doc._id}}, function (err, user) {
            if(user != null){
                var errors = [];
                if(user.email == req.body.email){
                    errors.push("Email already used");
                }
                if(user.phone == req.body.phone){
                    errors.push("Phone already used");
                }
                return renderForm(req, res, doc, errors);
            } else {

                // update password
                if (req.body.new_password && req.body.new_password != "") {
                    doc.new_password = req.body.new_password;
                    doc.genToken();
                    doc.setPassword(req.body.new_password);
                }

                saveModel(req, res, doc);
            }
        });
    });
});

module.exports = router;