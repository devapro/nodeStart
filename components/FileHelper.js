/**
 * Delete/copy/move file
 */

'use strict';

const log = require('./log')(module);
const fs = require('fs');

const FileHelper = {};

/**
 * Remove file
 * @param file
 */
FileHelper.delete = function(file){
    fs.unlink(file, function (err) {
        if (err) {
            log.error("Delete error: " + err);
        } else {
            log.info("Delete success: " + file);
        }
    });
};

/**
 * Copy file
 * @param source
 * @param des
 * @param cb
 */
FileHelper.copy = function(source, des, cb){
    var src = fs.createReadStream(source);
    var dest = fs.createWriteStream(des);
    src.pipe(dest);
    src.on('end', function() { log.info("success copy file"); cb();});
    src.on('error', function(err) { log.error("error copy file!" + source); cb(err);});
};

/**
 * Move file
 * @param source
 * @param des
 */
FileHelper.move = function(source, des, cb){
    if(!FileHelper.fileExists(source)){
        if(cb){
            cb(false);
        }
        return;
    }

    var src = fs.createReadStream(source);
    var dest = fs.createWriteStream(des);
    src.pipe(dest);
    src.on('end', function() {
        FileHelper.delete(source);
        log.info("success copy file");
        if(cb){
            cb(dest);
        }
    });
    src.on('error', function(err) {
        log.error("error copy file!" + source);
        log.error(err);
        if(cb){
            cb(false);
        }
    });
};

FileHelper.randomInteger = function (min, max) {
    var rand = min + Math.random() * (max - min);
    rand = Math.round(rand);
    return rand;
};

FileHelper.fileExists = function(filePath)
{
    var fs = require('fs');
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
};

module.exports = FileHelper;