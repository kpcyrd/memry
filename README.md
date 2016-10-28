# mem'ry [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![dependencies][dependency-image]][dependency-url] [![travis][travis-image]][travis-url]

[npm-image]: https://img.shields.io/npm/v/memry.svg
[npm-url]: https://npmjs.org/package/memry
[downloads-image]: https://img.shields.io/npm/dm/memry.svg
[downloads-url]: https://npmjs.org/package/memry
[dependency-image]: https://img.shields.io/david/kpcyrd/memry.svg
[dependency-url]: https://david-dm.org/kpcyrd/memry
[travis-image]: https://img.shields.io/travis/kpcyrd/memry.svg
[travis-url]: https://travis-ci.org/kpcyrd/memry

![logo](logo.jpg)

mem'ry was written for situations where you have to transfer files between two untrusted servers without the risk of compromising your private keys by forwarding your ssh keys (no sane person would do that, right?).

You don't need to install any software on the sending system since standard curl is sufficient. It also works on systems that are running low on disk as there's no need to create temporary files, multiple files can be uploaded by packing them with `tar`, writing the archive to stdout and streaming it into `curl`.

Basically, it's `nc` file transfer for http(s) (except that you actually know if a file was transferred completely or partially).

## Installation

```
npm install -g memry
```

## Usage

```
# upload one file
curl -sST- http://127.0.0.1:8018 < file.bin
# upload multiple files
tar cvvJ files/*.bin.part | curl -T- http://127.0.0.1:8018
# upload log files only readable by root on systems that don't allow ssh as root
sudo tar cvvJ /var/log/nginx | curl -T- http://127.0.0.1:8018
# upload a single file with working progress bar
curl -T file.bin http://127.0.0.1:8018
```

## Usage with docker

```
docker build -t memry .
mkdir storage
docker run --rm -p 80:8018 -v `pwd`/storage:/storage memry /storage -h 0.0.0.0
```

## License

MIT
