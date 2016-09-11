'use strict';

const co = require('co');
const fs = require('co-fs');
const confirm = require('../input/confirm');
const prompt = require('../input/prompt');
const clearFolder = require('../fs/clear_folder');
const createFolder = require('../fs/create_folder');
const createFile = require('../fs/create_file');

module.exports = function (args) {
  const path = process.cwd();
  co(function *() {
    const files = yield fs.readdir(path);
    if (files.length && !args.force) {
      const clearFolder = yield confirm('Folder not empty. Delete all files?');
      if (!clearFolder) {
        return false;
      }
    }

    yield createProject(path);

    return true;
  })
  .then(result => console.log(result ? 'Project created!' : 'Project not created.'))
  .catch(err => {
    console.error('Failed to create project.');
    console.error(err.message);
  });
};

function createProject(path) {
  return co(function *() {
    yield clearFolder(path);
    
    const settings = {
      title: getDirName(path),
      description: '',
      author: '',
      template: '',
      prettyUrls: true,
      language: 'en-US',
      url: `http://www.${getDirName(path)}.com`
    };

    yield createFile(path, 'ida.json', JSON.stringify(settings, null, 2));
    yield createFile(path, 'README.md', getReadme(settings.title));
    yield createFolder(path, '_site');
    yield createFolder(path, 'templates');
    yield createFolder(path, 'content');
  });
}

function getDirName(path) {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

function getReadme(title) {
  return `# Site: ${title}
`;
}