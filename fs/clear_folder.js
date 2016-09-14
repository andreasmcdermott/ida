'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (folderPath) {
  function clearFolder(path) {
    return co(function *() {
      const items = yield fs.readdir(path);
      for (const index in items) {
        yield deleteItem(`${path}/${items[index]}`);
      }
    });
  }

  function deleteItem(path) {
    return co(function *() {
      const stats = yield fs.stat(path);
      if (stats.isFile()) {
        yield fs.unlink(path);
      } else if (stats.isDirectory()) {
        yield clearFolder(path);
        yield fs.rmdir(path);
      } else {
        throw new Error(`"${path}" is not a file or directory.`);
      }
    });
  }

  return clearFolder(folderPath);
};