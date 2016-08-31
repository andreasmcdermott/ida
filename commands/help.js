'use strict';

const pkg = require('../package.json');
const version = require('./version');

module.exports = function () {
  version();
  [
    pkg.description,
    '',
    'Usage:',
    '  ida create [-f | --force]',
    '  ida [build]',
    '  ida -v | --version',
    '  ida -h | --help'
  ].forEach(ln => {
    console.log(ln);
  });
};