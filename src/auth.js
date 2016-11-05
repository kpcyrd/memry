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
var scrypt = require('scrypt');
var httpAuth = require('basic-auth');
var fs = require('fs');

var AuthDB = function(authFile) {
    var self = this;
    this.db = {};
    this.authFile = authFile;

    if(authFile) {
        var content = fs.readFileSync(authFile).toString();
        var lines = content.split('\n');
        lines.forEach(function(line) {
            line = line.trim();
            if(!line || line.startsWith('#')) return;
            var chunks = line.split(':');
            if(chunks.length != 2) return;
            self.db[chunks[0]] = chunks[1];
        });
    }

    this.auth = function(user, password, granted, denied) {
        if(!Object.hasOwnProperty.call(self.db, user)) {
            return denied();
        }

        var hash = self.db[user];
        scrypt.verifyKdf(new Buffer(hash, 'base64'), new Buffer(password), function(err, result) {
            if(err) return denied();

            if(result) {
                return granted({
                    user: user
                });
            } else {
                return denied();
            }
        });
    };
};

var authenticate = function(req, res, authDB, granted, denied) {
    if(!authDB.authFile) return granted({});

    var credentials = httpAuth(req);

    if(credentials) {
        var user = credentials.name || '';
        var password = credentials.pass || '';

        return authDB.auth(user, password, granted, denied);
    } else {
        denied();
    }
};

var exports = module.exports = {
    AuthDB: AuthDB,
    authenticate: authenticate,
};
