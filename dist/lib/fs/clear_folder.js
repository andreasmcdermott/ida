'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var fs = require('co-fs');

module.exports = function (folderPath) {
  function clearFolder(path) {
    return co(_regenerator2.default.mark(function _callee() {
      var items, index;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fs.readdir(path);

            case 2:
              items = _context.sent;
              _context.t0 = _regenerator2.default.keys(items);

            case 4:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 10;
                break;
              }

              index = _context.t1.value;
              _context.next = 8;
              return deleteItem(path + '/' + items[index]);

            case 8:
              _context.next = 4;
              break;

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));
  }

  function deleteItem(path) {
    return co(_regenerator2.default.mark(function _callee2() {
      var stats;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return fs.stat(path);

            case 2:
              stats = _context2.sent;

              if (!stats.isFile()) {
                _context2.next = 8;
                break;
              }

              _context2.next = 6;
              return fs.unlink(path);

            case 6:
              _context2.next = 16;
              break;

            case 8:
              if (!stats.isDirectory()) {
                _context2.next = 15;
                break;
              }

              _context2.next = 11;
              return clearFolder(path);

            case 11:
              _context2.next = 13;
              return fs.rmdir(path);

            case 13:
              _context2.next = 16;
              break;

            case 15:
              throw new Error('"' + path + '" is not a file or directory.');

            case 16:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));
  }

  return clearFolder(folderPath);
};