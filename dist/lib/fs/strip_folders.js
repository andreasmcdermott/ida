'use strict';

module.exports = function (fileName) {
  var indexOfLastSlash = fileName.lastIndexOf('/');
  var start = indexOfLastSlash + 1;
  return fileName.substr(start);
};