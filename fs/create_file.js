'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (path, name, data) {
  return co(function *() {
    yield fs.writeFile(`${path}/${name}`, data, 'utf8');
  });
};
