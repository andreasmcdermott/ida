'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var fs = require('co-fs');

module.exports = function (project_root) {
  return co(_regenerator2.default.mark(function _callee() {
    var json;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fs.readFile(project_root + '/ida.json');

          case 2:
            json = _context.sent;
            return _context.abrupt('return', JSON.parse(json));

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (err) {
    throw new Error('"ida.json" was not found in "' + project_root + '". Are you sure this is the project root?');
  });
};