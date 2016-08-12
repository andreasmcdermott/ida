'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (path, name) {
  return co(function *() {
    yield fs.mkdir(`${path}/${name}`);
  });
};
