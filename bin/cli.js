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
var memry = require('..');

var path = argv._[0] || process.env.MEMRY_STORAGE;
if(!path) {
    console.error('Usage: memry <storage-path>');
    process.exit(1);
}
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
