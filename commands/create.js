'use strict';

const co = require('co');
const fs = require('co-fs');
const confirm = require('../input/confirm');
const prompt = require('../input/prompt');
const clearFolder = require('../fs/clear_folder');
const createFolder = require('../fs/create_folder');
const createFile = require('../fs/create_file');
const exists = require('../fs/exists');

module.exports = function (args) {
  const name = args._[0] || '';
  const force = args.force;
  const currentDir = process.cwd();
  const path = `${currentDir}${name ? `/${name}` : ``}`;

  co(function *() {
    const folderExists = yield exists(path);
    if (!folderExists) {
      createFolder(currentDir, name);
    } else {
      const files = yield fs.readdir(path);
      if (files.length && !force) {
        const clearFolder = yield confirm('Folder not empty. Delete all files?');
        if (!clearFolder) {
          return false;
        }
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
      theme: '',
      prettyUrls: true,
      language: 'en',
      url: `http://www.${getDirName(path)}.com`
    };

    yield createFile(path, 'ida.json', JSON.stringify(settings, null, 2));
    yield createFile(path, 'README.md', getReadme(settings.title));
    yield createFolder(path, '_site');
    yield createFolder(path, 'themes');
    yield createFolder(path, 'content');
    yield createFolder(path, 'layout');
    yield createFolder(`${path}/layout`, 'templates');
    yield createFolder(`${path}/layout`, 'assets');
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