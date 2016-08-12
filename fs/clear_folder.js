'use strict';

const co = require('co');
const fs = require('co-fs');
const deleteItem = require('./delete_item');

module.exports = function (path) {
  return co(function *() {
    const items = yield fs.readdir(path);
    for (const index in items) {
      yield deleteItem(`${path}/${items[index]}`);
    }
  });
};
