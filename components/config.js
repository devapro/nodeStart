/**
 * Application config module
 */

'use strict';

const nconf = require('nconf');

let env = "";
switch (process.env.NODE_ENV){
    case "production":
        env = "_prod";
        break;
    case "dev":
        env = "_dev";
        break;
}

nconf.argv()
    .env()
    .file({ file: './config' + env + '.json' });

module.exports = nconf;