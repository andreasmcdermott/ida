'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (path) {
  return co(function *() {
    yield fs.stat(path);
    return true;
  })
  .catch(function (err) {
    return false;
  });
};