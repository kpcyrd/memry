#!/usr/bin/node
/* vim: set expandtab ts=4 sw=4: */
/*
 * You may redistribute this program and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var http = require('http');
var https = require('https');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var auth = require('./auth');
var adapters = require('./adapter');

var random = function(len) {
    return crypto.randomBytes(len).toString('hex');
};

exports.auth = auth;

var makeServer = function(options, callback) {
    var server;

    if(options.tlsKey && options.tlsCert) {
        server = https.createServer({
            key: fs.readFileSync(options.tlsKey),
            cert: fs.readFileSync(options.tlsCert),
        }, callback);
        server.scheme = 'https';
    } else {
        server = http.createServer(callback);
        server.scheme = 'http';
    }

    return server;
};

exports.streamToStorage = streamToStorage = function(options, transferOptions, stream, done) {
    options = options || {};
    var storageAdapter = options.adapter;
    var filenameLength = options.filenameLength || 16;
    var storagePath = options.path;
    var storageArgs = options.args || [];

    var adapter = adapters.get(storageAdapter, storagePath, storageArgs);

    var id = transferOptions.id || random(filenameLength);
    var user = transferOptions.user || '(anonymous)';

    var log = function(text) {
        console.log('[%s/%s] %s', id, user, text);
    };

    log('streaming');
    adapter(id, function(session) {
        stream.pipe(session.stream);

        // workaround for systems without Promise
        var stages = 2;

        var finish = function() {
            log('finishing');
            session.done(function() {
                log('done');
                done(id);
            });
        };

        session.stream.on('finish', function() {
            // all bytes have been flushed
            if(!--stages) finish();
        });

        stream.on('close', function() {
            // stream is closing
            // this is an abortion unless end has already been called
            if(stages != 2) return;

            log('request got aborted');
            session.abort();
        });

        stream.on('end', function() {
            // all bytes have been read
            if(!--stages) finish();
        });
    });
};

exports.createServer = function(options) {
    options = options || {};
    var authDB = new auth.AuthDB(options.authFile);

    return makeServer(options, function(req, res) {
        if(req.method == 'GET') {
            res.writeHead(200);
            return res.end('k.\n');
        }

        auth.authenticate(req, res, authDB, function(credentials) {
            streamToStorage(options, {
                user: credentials.user,
            }, req, function(id) {
                res.writeHead(200);
                res.end(JSON.stringify({
                    'status': 'ok',
                    'id': id
                }) + '\n');
            });
        }, function() {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="auth"');
            console.log('access denied');
            res.end('access denied');
        });
    });
};
