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

var AWS = require('aws-sdk');
var s3Stream = require('s3-upload-stream')(new AWS.S3());

// TODO: configure s3Stream

module.exports = (function(storagePath) {
    return (function(id, ready) {
        // TODO: create actual stream
        var stream = null;

        ready({
            stream: stream,
            abort: function() {
                // TODO: might have to signal failure explicitly
                stream.end();
            },
            done: function(cb) {
                // TODO: implement success signaling
                cb();
            },
        });
    });
});
