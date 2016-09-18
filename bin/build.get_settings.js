'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (project_root) {
  return co(function *() {
    const json = yield fs.readFile(`${project_root}/ida.json`);
    return JSON.parse(json);
  })
  .catch(err => {
    throw new Error(`"ida.json" was not found in "${project_root}". Are you sure this is the project root?`);
  });
};