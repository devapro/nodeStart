'use strict';

console.log("init");

const CronJob = require('cron').CronJob;


new CronJob('0 */30 * * * *', function() {
    
}, null, true, 'America/Los_Angeles');