#!/usr/bin/env node

'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _confirm = require('../lib/input/confirm');

var _confirm2 = _interopRequireDefault(_confirm);

var _createFile = require('../lib/fs/create-file');

var _createFile2 = _interopRequireDefault(_createFile);

var _createFolder = require('../lib/fs/create-folder');

var _createFolder2 = _interopRequireDefault(_createFolder);

var _exists = require('../lib/fs/exists');

var _exists2 = _interopRequireDefault(_exists);

var _isEmpty = require('../lib/fs/is-empty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _readme = require('../lib/create/readme');

var _readme2 = _interopRequireDefault(_readme);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IS_DEV = process.env.NODE_ENV === 'development';
var argv = (0, _minimist2.default)(process.argv.slice(2), {
  alias: {
    help: ['h']
  }
});
var force = argv.force || argv.f;

var help = function help() {
  console.log('\n  ' + _chalk2.default.bold('ida create') + ' [name]\n\n  ' + _chalk2.default.dim('Options:') + '\n\n    -h, --help         Output usage information\n    -f, --force        Will delete all files if project folder already exists\n\n  ' + _chalk2.default.dim('Examples:') + '\n\n  ' + _chalk2.default.gray('-') + ' Create new project in current directory:\n\n    ' + _chalk2.default.cyan('$ ida create') + '\n\n  ' + _chalk2.default.gray('-') + ' Create new project in new folder:\n\n    ' + _chalk2.default.cyan('$ ida create new-project') + '\n\n    ' + _chalk2.default.dim('Will create a new project in folder "./new-project"') + '\n  ');
};

var exit = function exit(code) {
  setTimeout(function () {
    return process.exit(code || 0);
  }, 100);
};

var create = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(path) {
    var clearFolder, title, settings;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _exists2.default)(path);

          case 2:
            if (_context.sent) {
              _context.next = 7;
              break;
            }

            _context.next = 5;
            return (0, _createFolder2.default)(path);

          case 5:
            _context.next = 18;
            break;

          case 7:
            _context.next = 9;
            return (0, _isEmpty2.default)(path);

          case 9:
            _context.t0 = !_context.sent;

            if (!_context.t0) {
              _context.next = 12;
              break;
            }

            _context.t0 = !force;

          case 12:
            if (!_context.t0) {
              _context.next = 18;
              break;
            }

            _context.next = 15;
            return (0, _confirm2.default)('Folder not empty. Delete all files?');

          case 15:
            clearFolder = _context.sent;

            if (clearFolder) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('return', false);

          case 18:
            _context.next = 20;
            return (0, _del2.default)([path + '/**', '!' + path]);

          case 20:
            title = (0, _path.basename)(path);
            settings = {
              title: title,
              description: '',
              author: '',
              theme: '',
              prettyUrls: true,
              language: 'en',
              url: 'http://www.' + title + '.com'
            };
            _context.next = 24;
            return (0, _createFile2.default)(path, _constants2.default.SETTINGS_FILE, (0, _stringify2.default)(settings, null, 2));

          case 24:
            _context.next = 26;
            return (0, _createFile2.default)(path, 'README.md', (0, _readme2.default)(settings.title));

          case 26:
            _context.next = 28;
            return (0, _createFolder2.default)(path, _constants2.default.OUTPUT_DIR);

          case 28:
            _context.next = 30;
            return (0, _createFolder2.default)(path, _constants2.default.THEMES_DIR);

          case 30:
            _context.next = 32;
            return (0, _createFolder2.default)(path, _constants2.default.CONTENT_DIR);

          case 32:
            _context.next = 34;
            return (0, _createFolder2.default)(path, _constants2.default.LAYOUT_DIR);

          case 34:
            _context.next = 36;
            return (0, _createFolder2.default)(path, _constants2.default.LAYOUT_DIR, _constants2.default.TEMPLATES_DIR);

          case 36:
            _context.next = 38;
            return (0, _createFolder2.default)(path, _constants2.default.LAYOUT_DIR, _constants2.default.ASSETS_DIR);

          case 38:
            return _context.abrupt('return', true);

          case 39:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function create(_x) {
    return _ref.apply(this, arguments);
  };
}();

if (argv.help) {
  help();
  exit(0);
} else {
  (function () {
    var path = process.cwd();
    if (argv._[0]) {
      path = (0, _path.resolve)(process.cwd(), argv._[0]);
    }

    create(path).then(function (success) {
      if (success) {
        console.log(_chalk2.default.bold.green('New project created in: ' + path));
      } else {
        console.log(_chalk2.default.bold.yellow('Project not created.'));
      }
    }).catch(function (err) {
      console.log(_chalk2.default.bold.red('Failed to create project.'));
      if (IS_DEV) {
        console.log(_chalk2.default.red(err));
      }
    });
  })();
}