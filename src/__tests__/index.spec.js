const affixHash = require('../');
const fs = require('fs');
const rimraf = require('rimraf');

describe('affix-hash', () => {
  beforeEach(() => {
    fs.mkdirSync('tests');
    fs.writeFileSync('tests/example-file.txt', 'Hello World!');
    fs.writeFileSync('tests/example-file.md', '# Some Markdown');
    fs.writeFileSync('tests/.ignored', 'Look, no extension!');
  });

  afterEach(() => {
    rimraf.sync('tests');
  });

  it('affixes a hash to filenames', async () => {
    const filenames = await affixHash('tests/**/*.txt');
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e84.txt' });
  });

  it('has default values for its options parameter', async () => {
    const filenames = await affixHash('tests/**/*.txt', {});
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e84.txt' });
  });

  it('works with an array of patterns', async () => {
    const filenames = await affixHash(['tests/**/*', '!tests/**/*.md']);
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e84.txt' });
  });

  it('works with a tiny buffer length', async () => {
    const filenames = await affixHash('tests/**/*.txt', { bufferLength: 1 });
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e84.txt' });
  });

  it('works with a large buffer length', async () => {
    const filenames = await affixHash('tests/**/*.txt', { bufferLength: 32768 });
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e84.txt' });
  });

  // TODO: Find a good way to test hashing a large file
  xit('works with a large file', async () => {
    const filenames = await affixHash('tests/**/*.bin');
    expect(filenames).toEqual({ 'tests/example-file.bin': 'tests/example-file.TODO.bin' });
  });

  it('hashes using a different hash algorithm', async () => {
    const filenames = await affixHash('tests/**/*.txt', { hashAlgorithm: 'sha512' });
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.861844d6704e8573fec3.txt' });
  });

  it('concatenates the hash length to the desired length', async () => {
    const filenames = await affixHash('tests/**/*.txt', { hashLength: 10 });
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed07628753.txt' });
  });

  it('outputs the maximum hash length if the desired length is greater than it', async () => {
    const filenames = await affixHash('tests/**/*.txt', { hashLength: 1000 });
    expect(filenames).toEqual({ 'tests/example-file.txt': 'tests/example-file.ed076287532e86365e841e92bfc50d8c.txt' });
  });
});
