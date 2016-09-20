'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _asyncFs = require('./async-fs');

var _asyncFs2 = _interopRequireDefault(_asyncFs);

var _isDirectory = require('./is-directory');

var _isDirectory2 = _interopRequireDefault(_isDirectory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(root) {
    var iterateFiles = function () {
      var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(subPath) {
        var allFiles, path, fileNames, promises, files, i, file;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                allFiles = [];
                path = subPath ? (0, _path.resolve)(root, subPath) : root;
                _context.next = 4;
                return _asyncFs2.default.readdir(path);

              case 4:
                fileNames = _context.sent;
                promises = fileNames.map(function (file) {
                  return _asyncFs2.default.stat((0, _path.resolve)(path, file));
                });
                _context.next = 8;
                return _promise2.default.all(promises);

              case 8:
                files = _context.sent;


                promises = [];
                for (i = 0; i < files.length; ++i) {
                  file = files[i];

                  if (file.isFile()) {
                    allFiles.push((0, _path.resolve)(path, fileNames[i]));
                  } else if (file.isDirectory()) {
                    promises.push(iterateFiles((0, _path.resolve)(path, fileNames[i])));
                  }
                }

                if (!promises.length) {
                  _context.next = 16;
                  break;
                }

                _context.next = 14;
                return _promise2.default.all(promises);

              case 14:
                _context.t0 = function (files) {
                  allFiles = allFiles.concat(files);
                };

                _context.sent.forEach(_context.t0);

              case 16:
                return _context.abrupt('return', allFiles);

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function iterateFiles(_x2) {
        return _ref2.apply(this, arguments);
      };
    }();

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _isDirectory2.default)(root);

          case 2:
            if (_context2.sent) {
              _context2.next = 4;
              break;
            }

            throw new Error('"' + root + '" exists, but is not a folder.');

          case 4:
            _context2.next = 6;
            return iterateFiles();

          case 6:
            return _context2.abrupt('return', _context2.sent);

          case 7:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  function getAllFiles(_x) {
    return _ref.apply(this, arguments);
  }

  return getAllFiles;
}();