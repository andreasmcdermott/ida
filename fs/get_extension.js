'use strict';

module.exports = function (filePath) {
  const indexOfExtension = fileName.lastIndexOf('.');
  return filePath.substr(indexOfExtension + 1);
}