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
      message: 'Project name'
    }];

    const settings = yield prompt(questions);
    yield createFile(path, 'ida.properties', JSON.stringify(settings, null, 2));
    yield createFile(path, 'index.html', getIndexHtml(settings.name));
    yield createFolder(path, 'site');
  });
};

function getDirName(path) {
  const parts = path.split('/');
  return parts[parts.length - 1];
}

function getIndexHtml(name) {
  return `<!doctype html>
  <html lang="en">
  <head>
    <title>${name}</title>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Welcome to Ida!</h1>
    <p>
      <strong>Next steps:</strong>
      <ol>
        <li>Update layout</li>
        <li>Add pages and posts</li>
        <li>Run "ida build"</li>
        <li>Upload to content of "site" to your favorite host</li>
      </ol>
    </p>
  </body>
  </html>
  `;
}
