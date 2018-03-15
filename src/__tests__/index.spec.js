const affixHash = require('../');
const fs = require('fs');
const rimraf = require('rimraf');

describe('affix-hash', () => {
  beforeEach(() => {
    rimraf.sync('temp');
    fs.mkdirSync('temp');
    fs.writeFileSync('temp/example-file.txt', 'Hello World!');
    fs.writeFileSync('temp/example-file.md', '# Some Markdown');
    fs.writeFileSync('temp/.ignored', 'Look, no extension!');
  });

  it('affixes a hash to filenames', async () => {
    const filenames = await affixHash('temp/**/*.txt');
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e84.txt' });
  });

  it('has default values for its options parameter', async () => {
    const filenames = await affixHash('temp/**/*.txt', {});
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e84.txt' });
  });

  it('works with an array of patterns', async () => {
    const filenames = await affixHash(['temp/**/*', '!temp/**/*.md']);
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e84.txt' });
  });

  it('works with a tiny buffer length', async () => {
    const filenames = await affixHash('temp/**/*.txt', { bufferLength: 1 });
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e84.txt' });
  });

  it('works with a large buffer length', async () => {
    const filenames = await affixHash('temp/**/*.txt', { bufferLength: 32768 });
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e84.txt' });
  });

  // TODO: Find a good way to test hashing a large file
  xit('works with a large file', async () => {
    const filenames = await affixHash('temp/**/*.bin');
    expect(filenames).toEqual({ 'temp/example-file.bin': 'temp/example-file.TODO.bin' });
  });

  it('hashes using a different hash algorithm', async () => {
    const filenames = await affixHash('temp/**/*.txt', { hashAlgorithm: 'sha512' });
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.861844d6704e8573fec3.txt' });
  });

  it('concatenates the hash length to the desired length', async () => {
    const filenames = await affixHash('temp/**/*.txt', { hashLength: 10 });
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed07628753.txt' });
  });

  it('outputs the maximum hash length if the desired length is greater than it', async () => {
    const filenames = await affixHash('temp/**/*.txt', { hashLength: 1000 });
    expect(filenames).toEqual({ 'temp/example-file.txt': 'temp/example-file.ed076287532e86365e841e92bfc50d8c.txt' });
  });
});
