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
var mongo = require('mongodb');
var Grid = require('gridfs-stream');

module.exports = (function(url) {
    return (function(id, ready) {
        var client = mongo.MongoClient.connect(url, function(err, db) {
            var gfs = Grid(db, mongo);

            var stream = gfs.createWriteStream({
                filename: id + '.bin.part'
            });

            ready({
                stream: stream,
                abort: function() {
                    stream.end();
                },
                done: function(cb) {
                    db.collection('fs.files').update({
                        'filename': id + '.bin.part'
                    }, {
                        '$set': {
                            'filename': id + '.bin'
                        }
                    }, function(err, object) {
                        cb();
                    });
                },
            });
        });
    });
});
