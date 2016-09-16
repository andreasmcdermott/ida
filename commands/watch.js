'use strict';

const fs = require('fs');
const build = require('./build')

module.exports = function () {
  const watched = [
    'content',
    'themes',
    'layout/templates',
    'layout/assets',
    'ida.json'
  ];
  const path = process.cwd();
  const watcher = fs.watch(path, { recursive: true }, function (eventType, fileName) {
    if (watched.some(path => fileName.startsWith(path))) {
      build();
      console.log('Updated..');
    }
  });
};