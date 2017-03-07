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
module.exports = exports = {
    adapters: {
        'fs': require('./adapter-fs'),
        'stdio': require('./adapter-stdio'),
        'gridfs': require('./adapter-gridfs'),
        's3': require('./adapter-s3'),
    },
    get: function(key, path, args) {
        if(Object.hasOwnProperty.call(exports.adapters, key)) {
            return exports.adapters[key](path, args);
        }
    }
};
