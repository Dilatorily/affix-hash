const crypto = require('crypto');
const fs = require('fs');
const globby = require('globby');
const path = require('path');

module.exports = async (patterns, options = {
  bufferLength: 8192,
  hashAlgorithm: 'md5',
  hashLength: 20,
}) => {
  const filenames = await globby(patterns);
  const newFilenames = {};

  filenames.forEach((filename) => {
    const extension = path.extname(filename);

    if (extension) {
      const file = fs.openSync(filename, 'r');
      const hash = crypto.createHash(options.hashAlgorithm);
      const buffer = Buffer.alloc(options.bufferLength);

      try {
        let bytes;
        do {
          bytes = fs.readSync(file, buffer, 0, options.bufferLength);
          hash.update(buffer.slice(0, bytes));
        } while (bytes === options.bufferLength);
      } finally {
        fs.closeSync(file);
      }

      const md5Hash = hash.digest('hex').substring(0, options.hashLength);
      const newFilename = [filename.slice(0, -extension.length), md5Hash, extension.substring(1)].join('.');
      newFilenames[filename] = newFilename;
    }
  });

  return newFilenames;
};
