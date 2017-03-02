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
var spawn = require('child_process').spawn;

/*
 * Basic usage of this adapter works like this:
 *
 * 1) On successfull completion, EOF is signaled on stdin
 * 2) On abortion, SIGTERM is sent to the child
 * 3) When EOF is sent, it's waiting for the program to exit
 * 4) The process is never forcefully killed, they MUST behave correctly
 *    when either occurs.
 *
 * A very basic example that roughly translates to adapter-fs
 * looks like this:
 *
 *     #!/bin/sh
 *     set -e
 *     cat > "files/$1.bin.part"
 *     mv "files/$1.bin.part" "files/$1.bin"
 *
 * The request body is read by `cat` and written to a file.
 * When the request is aborted, SIGTERM is sent to cat,
 * which makes it exit with an error code.
 * Since the script uses `set -x` this causes the script
 * to exit and `mv` is never executed.
 *
 * When EOF is sent, this causes `cat` to exit with 0 so the
 * script continues with executing `mv` to signal upload
 * completion on the filesystem.
 *
 * An adapter that streams to another memry instance, while correctly
 * forwarding success/error would look like this:
 *
 *     #!/bin/sh
 *     curl -sST- https://example.com/
 *
 */

module.exports = (function(prog, args) {
    return (function(id, ready) {
        var child = spawn(prog, args.concat([id]), {
            stdio: ['pipe', 'inherit', 'inherit']
        });

        var stream = child.stdin;

        ready({
            stream: stream,
            pipeFrom: function(req) {
                req.pipe(stream);
            },
            abort: function() {
                child.kill('SIGTERM');
            },
            done: function(cb) {
                child.on('exit', function() {
                    cb(); // TODO: indicate success/error
                });
                stream.end();
            },
        });
    });
});
