'use strict';

const pkg = require('../package.json');

module.exports = function () {
  console.log(`${pkg.name} v${pkg.version}`);
};