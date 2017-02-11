/**
 * Send email
 */

'use strict';

const log = require('../log')(module);
const config = require('../config');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport(config.get("mail_config"));

const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');

const email = {};

/**
 * Send with template
 * @param email
 * @param subject
 * @param text
 * @param template
 */
email.sendTemplate = function (user, subject, data, template) {
    var templateDir = path.join(__dirname, '../../views/email_template', template);
    var tmpl = new EmailTemplate(templateDir);

    var variables = {user: user, data: data};

    tmpl.render(variables, function (err, result) {
        if(err){
            log.error(err);
            return false;
        }
        // result.html
        // result.text
        email.send(user.email, subject, result.html, result.text);
    });
};

/**
 * Send email
 * @param email
 * @param subject
 * @param text
 */
email.send = function (email, subject, html, text) {
    log.debug('send email ' + text + ' to ' + email + 'from ' + '"EasyForms.pro" <'+ config.get("sys:info_email") +'>');

    var mailOptions = {
        from: '"EasyForms.pro" <'+ config.get("sys:info_email") +'>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: text ? text : html, // plaintext body
        html: html // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        log.debug('Message sent: ' + info.response);
    });

};

module.exports = email;