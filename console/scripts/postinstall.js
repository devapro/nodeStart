'use strict';

const shell  = require('shelljs');
shell.exec('cd ./public && bower i', function(code) {
    console.log('    Updating Bower dependencies');
});