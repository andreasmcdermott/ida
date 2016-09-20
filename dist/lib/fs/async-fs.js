'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _denodeify = require('denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var methods = ['stat', 'mkdir', 'writeFile', 'readFile', 'readdir'];
var asyncFs = {};

methods.forEach(function (method) {
  asyncFs[method] = (0, _denodeify2.default)(_fs2.default[method]);
});

exports.default = asyncFs;