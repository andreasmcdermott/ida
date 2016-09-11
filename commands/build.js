'use strict';

const co = require('co');
const helpers = require('./build_helpers');

module.exports = function () {
  const path = process.cwd();
  co(function *() {
    const settings = yield helpers.get_settings(path);
    const layoutPath = yield helpers.get_layout_folder(path, settings);
    const content = yield helpers.get_content(path);
  })
  .catch(err => {
    console.error('Failed to build project.');
    console.error(err.message);
  })
};