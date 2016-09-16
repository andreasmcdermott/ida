'use strict';

const fs = require('fs');
const build = require('./build')

module.exports = function () {
  const ignore = [
    '.git',
    '_site',
  ];
  const path = process.cwd();
  const watcher = fs.watch(path, { recursive: true }, function (eventType, fileName) {
    if (fileName.startsWith('.') || fileName.startsWith('_site')) {
      return;
    }
    if (fileName.startsWith('layout') && 
        !(fileName.startsWith('layout/templates') || fileName.startsWith('layout/assets'))) {
      return;
    }

    build();
    console.log('Building..');
  });
};