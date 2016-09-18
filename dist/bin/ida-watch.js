'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watch;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function watch() {
  var watched = ['content', 'themes', 'layout/templates', 'layout/assets', 'ida.json'];
  var path = process.cwd();
  _fs2.default.watch(path, { recursive: true }, function (eventType, fileName) {
    if (watched.some(function (path) {
      return fileName.startsWith(path);
    })) {
      (0, _build2.default)();
      console.log('Updated!');
    }
  });
}