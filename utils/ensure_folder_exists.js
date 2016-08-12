'use strict';

const fs = require('fs');

module.exports = function (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (noSuchDir, stats) => {
      if (noSuchDir) {
        fs.mkdir(path, err => {
          if (err) reject(new Error(err));
          else resolve();
        })
      } else if (!stats.isDirectory()) reject(new Error(`"${path}" is not a folder.`));
      else resolve();
    });
  });
};
