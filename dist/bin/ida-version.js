'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = version;

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version() {
  console.log(_package2.default.name + ' v' + _package2.default.version);
}