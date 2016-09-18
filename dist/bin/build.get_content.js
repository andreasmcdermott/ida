'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var co = require('co');
var fs = require('co-fs');
var getAllFiles = require('../fs/get_all_files');
var stripFolderAndExtension = require('../fs/strip_folder_and_extension');
var marked = require('marked');

module.exports = function (project_root) {
  return co(_regenerator2.default.mark(function _callee() {
    var content_root, stats, files, content, i, file, fileContent, parsedContent, fileName, folders, name;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            content_root = project_root + '/content';
            _context.next = 3;
            return fs.stat(content_root);

          case 3:
            stats = _context.sent;

            if (stats.isDirectory()) {
              _context.next = 6;
              break;
            }

            throw new Error('"' + content_root + '" exists, but is not a folder.. That\'s weird.');

          case 6:
            _context.next = 8;
            return getAllFiles(content_root);

          case 8:
            files = _context.sent;
            content = [];
            i = 0;

          case 11:
            if (!(i < files.length)) {
              _context.next = 24;
              break;
            }

            file = files[i];
            _context.next = 15;
            return fs.readFile(file, 'utf8');

          case 15:
            fileContent = _context.sent;
            parsedContent = parseFileContent(fileContent);
            fileName = file.substr(content_root.length + 1);
            folders = fileName.split('/').slice(0, -1);
            name = stripFolderAndExtension(fileName);


            content.push({
              name: name,
              folders: folders,
              config: parsedContent.config || {},
              markdown: parsedContent.markdown || '',
              html: parsedContent.html || '',
              error: parsedContent.error
            });

          case 21:
            ++i;
            _context.next = 11;
            break;

          case 24:
            return _context.abrupt('return', content);

          case 25:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  })).catch(function (err) {
    console.error(err.message);
  });
};

function parseFileContent(fileContent) {
  fileContent = fileContent.trim();
  var parsedContent = { config: null, markdown: null, html: null, error: null };

  if (fileContent.startsWith('{')) {
    try {
      var config = getConfig(fileContent);
      parsedContent.config = JSON.parse(config);
      fileContent = fileContent.substr(config.length);
    } catch (err) {
      parsedContent.error = err;
    }
  }

  parsedContent.markdown = fileContent.trim();
  parsedContent.html = marked(parsedContent.markdown);

  return parsedContent;
}

function getConfig(fileContent) {
  var open = 0;

  for (var i = 0; i < fileContent.length; ++i) {
    if (fileContent[i] === '{') {
      ++open;
    } else if (fileContent[i] === '}') {
      --open;

      if (open === 0) {
        return fileContent.substr(0, i + 1);
      }
    }
  }

  throw new Error('Invalid JSON.');
}