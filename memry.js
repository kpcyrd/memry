#!/usr/bin/node
var http = require('http');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var random = function(len) {
    return crypto.randomBytes(len).toString('hex');
};

exports.createServer = function(options) {
    options = options || {};
    var filenameLength = options.filenameLength || 16;
    var storagePath = options.path;

    return http.createServer(function(req, res) {
        // TODO: PUT only
        var id = random(filenameLength);
        var destPath = path.join(storagePath, id + '.bin');
        var tempPath = destPath + '.part';

        var log = function(text) {
            console.log('[%s] %s', id, text);
        };

        log('streaming ==> ' + tempPath);
        var stream = fs.createWriteStream(tempPath);
        req.pipe(stream)

        req.on('close', function() {
            log('request got aborted');
            stream.end();
        });

        req.on('end', function() {
            fs.rename(tempPath, destPath, function() {
                log('done ==> ' + destPath);
                res.writeHead(200);
                res.end(JSON.stringify({
                    'status': 'ok',
                    'id': id
                }) + '\n');
            });
        });
    });
};
