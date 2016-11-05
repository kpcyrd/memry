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
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var auth = require('./src/auth');

var random = function(len) {
    return crypto.randomBytes(len).toString('hex');
};

exports.auth = auth;
exports.createServer = function(options) {
    options = options || {};
    var filenameLength = options.filenameLength || 16;
    var storagePath = options.path;

    var authDB = new auth.AuthDB(options.authFile);

    return http.createServer(function(req, res) {
        var user = '(anonymous)';
        var id = random(filenameLength);
        var destPath = path.join(storagePath, id + '.bin');
        var tempPath = destPath + '.part';

        var log = function(text) {
            console.log('[%s/%s] %s', id, user, text);
        };

        auth.authenticate(req, res, authDB, function(credentials) {
            user = credentials.user || user;

            // TODO: PUT only
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
        }, function() {
            res.statusCode = 401;
            res.setHeader('WWW-Authenticate', 'Basic realm="auth"');
            log('access denied');
            res.end('access denied');
        });
    });
};
