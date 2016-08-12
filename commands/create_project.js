'use strict';

const co = require('co');
const utils = require('../utils/utils');

module.exports = function (path, name) {
  return co(function *() {
    yield utils.clearFolder(path);
    const questions = [{
      name: 'name',
      default: name || utils.getDirName(path),
      message: 'Project name'
    }];

    const settings = yield utils.prompt(questions);
    console.log(settings);
  });
};
