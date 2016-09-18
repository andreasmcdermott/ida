'use strict';

module.exports = function (filePath) {
  var indexOfExtension = fileName.lastIndexOf('.');
  return filePath.substr(indexOfExtension + 1);
};