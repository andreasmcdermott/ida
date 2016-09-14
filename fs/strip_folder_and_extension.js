'use strict';

module.exports = function (fileName) {
  const indexOfLastSlash = fileName.lastIndexOf('/');
  const indexOfExtension = fileName.lastIndexOf('.');
  const start = indexOfLastSlash + 1;
  return fileName.substr(start, fileName.length - start - (fileName.length - indexOfExtension));
};