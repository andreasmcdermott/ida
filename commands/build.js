'use strict';

const co = require('co');
const get_settings = require('./build.get_settings');
const get_layout = require('./build.get_layout');
const get_content = require('./build.get_content');

module.exports = function () {
  const path = process.cwd();
  co(function *() {
    const settings = yield get_settings(path);
    const layout = yield get_layout(path, settings);
    const content = yield get_content(path);
  })
  .catch(err => {
    console.error('Failed to build project.');
    console.error(err.message);
  })
};