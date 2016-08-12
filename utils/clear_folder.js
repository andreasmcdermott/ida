'use strict';

const fs = require('fs');

module.exports = function (dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, items) => {
      if (err) reject(err);
      else {
        Promise.all(items.map(item => deleteItem(`${dir}/${item}`)))
          .then(() => resolve())
          .catch(err => reject(err));
      }
    });
  });
};

function deleteItem(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
        if (err) reject(err);
        else if (stats.isFile()) {
          fs.unlink(path, (err) => {
            if (err) reject(err);
            else resolve();
          });
        } else if (stats.isDirectory()) {
          fs.rmdir(path, (err) => {
            if (err) reject(err);
            else resolve();
          })
        } else reject(`"${path}" is not a file or directory.`);
    });
  });
}
