#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2));
var memry = require('..');

var path = argv._[0];
if(!path) {
    console.error('Usage: memry <storage-path>');
    process.exit(1);
}
var port = parseInt(argv.port || argv.p || '8018');
var host = argv.host || argv.h || '127.0.0.1';

memry
    .createServer({
        'storage': 'fs',
        'path': path,
        'host': host,
        'port': port,
    })
    .listen(port, host, function() {
        console.log('[+] ready http://%s:%d -> %s', host, port, path);
    });
