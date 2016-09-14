'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (root) {
  return co(function *() {
    const stats = yield fs.stat(root);
    if (!stats.isDirectory()) {
      throw new Error(`"${root}" exists, but is not a folder.`);
    }

    function iterateFiles(subPath) {
      return co(function *() {
        let allFiles = [];
        const path = !subPath ? root : `${root}/${subPath}`;
        const files = yield fs.readdir(path);
        for (let i = 0; i < files.length; ++i) {
          const file = files[i];
          const filePath = `${path}/${file}`;
          yield co(function *() {
            const stats = yield fs.stat(filePath);
            if (stats.isFile()) {
              allFiles.push(filePath);
            } else if (stats.isDirectory()) {
              const filesInDir = yield iterateFiles(`${subPath}${file}`);
              allFiles = allFiles.concat(filesInDir);
            }
          });
        };

        return allFiles;
      });
    }

    return iterateFiles('');
  })
  .catch(function (err) {
    console.error(`Path ${root} doesn't exist.`);
  });
};