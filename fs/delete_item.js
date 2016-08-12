'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (path) {
  return co(function *() {
    const stats = yield fs.stat(path);
    if (stats.isFile()) {
      yield fs.unlink(path);
    } else if (stats.isDirectory()) {
      yield fs.rmdir(path);
    } else {
      throw new Error(`"${path}" is not a file or directory.`);
    }
  });
};
