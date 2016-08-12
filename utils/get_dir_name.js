'use strict';

module.exports = function (path) {
  const parts = path.split('/');
  return parts[parts.length - 1];
};
