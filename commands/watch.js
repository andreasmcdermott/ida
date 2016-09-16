'use strict';

const fs = require('fs');
const build = require('./build')

module.exports = function () {
  const ignore = [
    '.git',
    '_dist'
  ];
  const path = process.cwd();
  const watcher = fs.watch(path, { recursive: true }, function (eventType, fileName) {
    if (fileName.startsWith('.') || fileName.startsWith('_site')) {
      return;
    }

    build();
    console.log('Building..');
  });
};