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
var s3UploadStream = require('s3-upload-stream');

/*
 * Environment variables:
 *
 *   $AWS_ACCESS_KEY_ID
 *   $AWS_SECRET_ACCESS_KEY
 *   $AWS_REGION
 */

module.exports = (function(bucketName) {
    return (function(id, ready) {
        var s3Stream = s3UploadStream(new AWS.S3());

        var destKey = id + '.bin';
        var stream = s3Stream.upload({
            Bucket: bucketName,
            Key: destKey,
        });

        stream.on('error', function(error) {
            console.error(error);
        });

        ready({
            stream: stream,
            abort: function() {
                // TODO: might have to signal failure explicitly
                stream.end();
            },
            done: function(cb) {
                // TODO: implement success signaling
                stream.on('uploaded', function (details) {
                    cb();
                });
            },
        });
    });
});
