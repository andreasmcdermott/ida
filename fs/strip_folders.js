'use strict';

module.exports = function (fileName) {
  const indexOfLastSlash = fileName.lastIndexOf('/');
  const start = indexOfLastSlash + 1;
  return fileName.substr(start);
};