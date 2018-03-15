const crypto = require('crypto');
const fs = require('fs');
const globby = require('globby');
const path = require('path');

module.exports = async (patterns, options) => {
  const parameters = {
    bufferLength: 8192,
    hashAlgorithm: 'md5',
    hashLength: 20,
    ...options,
  };
  const filenames = await globby(patterns);
  const newFilenames = {};

  filenames.forEach((filename) => {
    const file = fs.openSync(filename, 'r');
    const extension = path.extname(filename);
    const hash = crypto.createHash(parameters.hashAlgorithm);
    const buffer = Buffer.alloc(parameters.bufferLength);

    try {
      let bytes;
      do {
        bytes = fs.readSync(file, buffer, 0, parameters.bufferLength);
        hash.update(buffer.slice(0, bytes));
      } while (bytes === parameters.bufferLength);
    } finally {
      fs.closeSync(file);
    }

    const md5Hash = hash.digest('hex').substring(0, parameters.hashLength);
    const newFilename = [filename.slice(0, -extension.length), md5Hash, extension.substring(1)].join('.');
    newFilenames[filename] = newFilename;
  });

  return newFilenames;
};
