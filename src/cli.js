#!/usr/bin/env node

const affixHash = require('.');
const fs = require('fs');
const meow = require('meow');
const updateNotifier = require('update-notifier');

const cli = meow(`
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
`, {
  flags: {
    'buffer-length': {
      type: 'string',
      alias: 'b',
      default: 8192,
    },
    'dry-run': {
      type: 'boolean',
      alias: 'd',
      default: false,
    },
    'hash-algorithm': {
      type: 'string',
      alias: 'a',
      default: 'md5',
    },
    'hash-length': {
      type: 'string',
      alias: 'l',
      default: 20,
    },
    manifest: {
      type: 'boolean',
      alias: 'm',
      default: false,
    },
    'manifest-name': {
      type: 'string',
      alias: 'n',
      default: 'manifest.json',
    },
  },
});

updateNotifier({ pkg: cli.pkg }).notify();

if (cli.input.length === 0) {
  cli.showHelp();
} else {
  (async () => {
    cli.flags.bufferLength = parseInt(cli.flags.bufferLength, 10);
    const filenames = await affixHash(cli.input, cli.flags);

    if (cli.flags.manifest) {
      fs.writeFileSync(cli.flags.manifestName, JSON.stringify(filenames, null, 2), 'utf-8');
    }

    Object.entries(filenames).forEach(([filename, newFilename]) => {
      if (cli.flags.dryRun) {
        console.log(newFilename); // eslint-disable-line no-console
      } else {
        fs.renameSync(filename, newFilename);
      }
    });
  })();
}
