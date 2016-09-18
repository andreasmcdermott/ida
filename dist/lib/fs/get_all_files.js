'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var fs = require('co-fs');

module.exports = function (root) {
  return co(_regenerator2.default.mark(function _callee3() {
    var stats, iterateFiles;
    return _regenerator2.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            iterateFiles = function iterateFiles(subPath) {
              return co(_regenerator2.default.mark(function _callee2() {
                var _this = this;

                var allFiles, path, files, _loop, i;

                return _regenerator2.default.wrap(function _callee2$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        allFiles = [];
                        path = !subPath ? root : '' + root + subPath;
                        _context3.next = 4;
                        return fs.readdir(path);

                      case 4:
                        files = _context3.sent;
                        _loop = _regenerator2.default.mark(function _loop(i) {
                          var file, filePath;
                          return _regenerator2.default.wrap(function _loop$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  file = files[i];
                                  filePath = path + '/' + file;
                                  _context2.next = 4;
                                  return co(_regenerator2.default.mark(function _callee() {
                                    var stats, filesInDir;
                                    return _regenerator2.default.wrap(function _callee$(_context) {
                                      while (1) {
                                        switch (_context.prev = _context.next) {
                                          case 0:
                                            _context.next = 2;
                                            return fs.stat(filePath);

                                          case 2:
                                            stats = _context.sent;

                                            if (!stats.isFile()) {
                                              _context.next = 7;
                                              break;
                                            }

                                            allFiles.push(filePath);
                                            _context.next = 12;
                                            break;

                                          case 7:
                                            if (!stats.isDirectory()) {
                                              _context.next = 12;
                                              break;
                                            }

                                            _context.next = 10;
                                            return iterateFiles(subPath + '/' + file);

                                          case 10:
                                            filesInDir = _context.sent;

                                            allFiles = allFiles.concat(filesInDir);

                                          case 12:
                                          case 'end':
                                            return _context.stop();
                                        }
                                      }
                                    }, _callee, this);
                                  }));

                                case 4:
                                case 'end':
                                  return _context2.stop();
                              }
                            }
                          }, _loop, _this);
                        });
                        i = 0;

                      case 7:
                        if (!(i < files.length)) {
                          _context3.next = 12;
                          break;
                        }

                        return _context3.delegateYield(_loop(i), 't0', 9);

                      case 9:
                        ++i;
                        _context3.next = 7;
                        break;

                      case 12:
                        ;

                        return _context3.abrupt('return', allFiles);

                      case 14:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee2, this);
              }));
            };

            _context4.next = 3;
            return fs.stat(root);

          case 3:
            stats = _context4.sent;

            if (stats.isDirectory()) {
              _context4.next = 6;
              break;
            }

            throw new Error('"' + root + '" exists, but is not a folder.');

          case 6:
            return _context4.abrupt('return', iterateFiles(''));

          case 7:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee3, this);
  })).catch(function (err) {
    console.error('Path ' + root + ' doesn\'t exist.');
  });
};