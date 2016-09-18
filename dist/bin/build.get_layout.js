'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var fs = require('co-fs');
var getAllFiles = require('../fs/get_all_files');
var stripFolderAndExtension = require('../fs/strip_folder_and_extension');
var stripFolders = require('../fs/strip_folders');

module.exports = function (projectRoot, settings) {
  return co(_regenerator2.default.mark(function _callee() {
    var pathToLayout, stats, files, partials, templates, hasAssets, i, file, fileName, folders, fileContent;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pathToLayout = settings.theme ? projectRoot + '/themes/' + settings.theme : projectRoot + '/layout';
            _context.next = 3;
            return fs.stat(pathToLayout);

          case 3:
            stats = _context.sent;

            if (stats.isDirectory()) {
              _context.next = 6;
              break;
            }

            throw new Error('"' + pathToLayout + '" exists, but is not a folder..? Weird.');

          case 6:
            _context.next = 8;
            return getAllFiles(pathToLayout);

          case 8:
            files = _context.sent;
            partials = [];
            templates = [];
            hasAssets = false;
            i = 0;

          case 13:
            if (!(i < files.length)) {
              _context.next = 26;
              break;
            }

            file = files[i];
            fileName = file.substr(pathToLayout.length + 1);

            if (fileName.startsWith('assets') || fileName.startsWith('templates')) {
              _context.next = 18;
              break;
            }

            return _context.abrupt('continue', 23);

          case 18:
            folders = fileName.split('/').slice(1, -1);
            _context.next = 21;
            return fs.readFile(file, 'utf8');

          case 21:
            fileContent = _context.sent;


            if (folders[0] === '_partials') {
              partials.push({
                name: stripFolderAndExtension(fileName),
                template: fileContent
              });
            } else {
              templates.push({
                folders: folders,
                name: stripFolderAndExtension(fileName),
                template: fileContent
              });
            }

          case 23:
            ++i;
            _context.next = 13;
            break;

          case 26:
            return _context.abrupt('return', { partials: partials, templates: templates, assetsDir: pathToLayout + '/assets' });

          case 27:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (err) {
    if (settings.template) {
      throw new Error('Couldn\'t find theme "' + settings.theme + '" in folder "' + project_root + '/themes.');
    } else {
      throw new Error('Couldn\'t find folder "' + project_root + '/layout".');
    }
  });
};