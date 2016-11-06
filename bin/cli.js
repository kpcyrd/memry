#!/usr/bin/env node
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
var argv = require('minimist')(process.argv.slice(2));
var read = require('read');
var memry = require('..');

var usage = function() {
    console.error('Usage: memry <htpasswd <user>|listen <storage-path>');
    process.exit(1);
};

var action = argv._[0] || 'listen';
switch(action) {
    case 'listen':
        var path = argv._[1] || process.env.MEMRY_STORAGE;
        if(!path) usage();

        var port = parseInt(argv.port || argv.p || process.env.MEMRY_PORT || '8018');
        var host = argv.host || argv.h || process.env.MEMRY_HOST || '127.0.0.1';
        var authFile = argv.auth || argv.a || process.env.MEMRY_AUTHFILE;

        memry
            .createServer({
                'storage': 'fs',
                'path': path,
                'host': host,
                'port': port,
                'authFile': authFile,
            })
            .listen(port, host, function() {
                console.log('[+] ready http://%s:%d -> %s', host, port, path);
            });
        break;

    case 'htpasswd':
        var user = argv._[1];
        if(!user) usage();

        var callback = function(err, password) {
            memry.auth.generate(password, {}, function(err, digest) {
                if(err) return console.error('error', err);
                console.log('%s:%s', user, digest);
            });
        };

        if(process.stdin.isTTY) {
            read({prompt: 'Password: ', silent: true}, callback);
        } else {
            process.stdin.on('data', function(buf) {
                callback(undefined, buf.toString().trim());
            });
        }
        break;

    default:
        usage();
}
