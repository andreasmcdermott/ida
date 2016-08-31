'use strict';

const co = require('co');
const fs = require('co-fs');
const prompt = require('../input/prompt');
const clearFolder = require('../fs/clear_folder');
const createFolder = require('../fs/create_folder');
const createFile = require('../fs/create_file');

module.exports = function (path, name) {
  return co(function *() {
    yield clearFolder(path);
    const questions = [{
      name: 'name',
      default: name || getDirName(path),
      message: 'Website title'
    }, {
      name: 'template',
      default: 'ida-default',
      message: 'Website template'
    }];

    const settings = yield prompt(questions);
    yield createFile(path, 'ida.json', JSON.stringify(settings, null, 2));
    yield createFile(path, 'README.md', getReadme(settings.name));
    yield createFolder(path, '_site');
    yield createFolder(path, 'templates');
    yield createFolder(path, 'content');
  });
};

function getDirName(path) {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

function getReadme(name) {
  return `
# Site: ${name}

* Next step: Do whatever
`;
}
