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
