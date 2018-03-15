# affix-hash
[![Build Status](https://travis-ci.org/Dilatorily/affix-hash.svg?branch=master)](https://travis-ci.org/Dilatorily/affix-hash)
[![codecov](https://codecov.io/gh/Dilatorily/affix-hash/branch/master/graph/badge.svg)](https://codecov.io/gh/Dilatorily/affix-hash)
Small CLI tool to affix a hash to filenames

## Install
```bash
$ npm install --global affix-hash
```

## Usage
```
$ affix-hash --help

  Small CLI tool to affix a hash to filenames

  Usage:
    $ affix-hash <path|glob> [options]

  Options:
    -a, --hash-algorithm  Hash algorithm used. Uses the same list as crypto.createHash. (Default: md5)
                          https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options
    -b, --buffer-length   Length in bytes of the buffer used to read the files. (Default: 8192)
    -d, --dry-run         List what would be renamed instead of renaming.
    -l, --hash-length     Length of the appended MD5 hash. (Default: 20)
    -m, --manifest        Creates a manifest of the renamed files. (Default: false)
    -n, --manifest-name   Name of the manifest file. (Default: manifest.json)

  Examples:
    $ affix-hash main.css -a sha512 -l 25
    $ affix-hash '**.md' '!node_modules' --dry-run
```

## Contributing
Contributions through pull requests are always welcome, no matter how large or small. Unit tests are appreciated!

## [License](LICENSE)
This repository is open source and distributed under the MIT License.
