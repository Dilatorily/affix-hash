const execa = require('execa');
const fs = require('fs');
const rimraf = require('rimraf');

describe('cli', () => {
  beforeEach(() => {
    rimraf.sync('temp');
    fs.mkdirSync('temp');
    fs.writeFileSync('temp/example-file.txt', 'Hello World!');
    fs.writeFileSync('temp/example-file.md', '# Some Markdown');
    fs.writeFileSync('temp/.ignored', 'Look, no extension!');
  });

  it('shows the help menu if we don\'t pass any parameters', async () => {
    try {
      await execa('./src/cli.js');
    } catch (error) {
      expect(error.code).toBe(2);
      expect(error.stdout).toBe('\n  Small CLI tool to affix a hash to filenames\n\n  Usage:\n    $ affix-hash <path|glob> [options]\n\n  Options:\n    -a, --hash-algorithm  Hash algorithm used. Uses the same list as crypto.createHash. (Default: md5)\n                          https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options\n    -b, --buffer-length   Length in bytes of the buffer used to read the files. (Default: 8192)\n    -d, --dry-run         List what would be renamed instead of renaming.\n    -l, --hash-length     Length of the appended MD5 hash. (Default: 20)\n    -m, --manifest        Creates a manifest of the renamed files. (Default: false)\n    -n, --manifest-name   Name of the manifest file. (Default: manifest.json)\n\n  Examples:\n    $ affix-hash main.css -a sha512 -l 25\n    $ affix-hash \'**.md\' \'!node_modules\' --dry-run\n\n');
      expect(fs.existsSync('temp/example-file.txt')).toBe(true);
      expect(fs.existsSync('temp/example-file.md')).toBe(true);
      expect(fs.existsSync('temp/.ignored')).toBe(true);
    }
  });

  it('affixes a hash to filenames', async () => {
    await execa('./src/cli.js', ['temp/**/*']);
    expect(fs.existsSync('temp/example-file.txt')).toBe(false);
    expect(fs.existsSync('temp/example-file.md')).toBe(false);
    expect(fs.existsSync('temp/.ignored')).toBe(true);
  });

  it('creates a manifest file of the renamed files', async () => {
    await execa('./src/cli.js', ['temp/**/*', '--manifest']);
    expect(fs.existsSync('manifest.json')).toBe(true);
    rimraf.sync('manifest.json');
  });

  it('uses the configured manifest filename', async () => {
    await execa('./src/cli.js', ['temp/**/*', '--manifest', '--manifest-name', 'test.json']);
    expect(fs.existsSync('test.json')).toBe(true);
    rimraf.sync('test.json');
  });

  it('does not modify the files with the dry run parameter', async () => {
    await execa('./src/cli.js', ['\'temp/**/*\'', '--dry-run']);
    expect(fs.existsSync('temp/example-file.txt')).toBe(true);
    expect(fs.existsSync('temp/example-file.md')).toBe(true);
    expect(fs.existsSync('temp/.ignored')).toBe(true);
  });
});
