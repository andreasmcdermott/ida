'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = help;

var _version = require('./version');

var _version2 = _interopRequireDefault(_version);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function help() {
  console.log((0, _version2.default)() + '\n    \n    Usage:\n      ida create [name] [-f | --force]\n      ida [build]\n      ida watch\n      ida -v | --version\'\n      ida -h | --help');
}