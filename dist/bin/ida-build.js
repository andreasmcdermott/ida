#!/usr/bin/env node

'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _copyDir = require('copy-dir');

var _copyDir2 = _interopRequireDefault(_copyDir);

var _denodeify = require('denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var _handlebars = require('handlebars');

var _handlebars2 = _interopRequireDefault(_handlebars);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _asyncFs = require('../lib/fs/async-fs');

var _asyncFs2 = _interopRequireDefault(_asyncFs);

var _isDirectory = require('../lib/fs/is-directory');

var _isDirectory2 = _interopRequireDefault(_isDirectory);

var _getAllFiles = require('../lib/fs/get-all-files');

var _getAllFiles2 = _interopRequireDefault(_getAllFiles);

var _helpers = require('../lib/hbs/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ignoreFiles = ['.DS_Store'];

var IS_DEV = process.env.NODE_ENV === 'development';
var argv = (0, _minimist2.default)(process.argv.slice(2), {
  alias: {
    help: ['h']
  }
});

var help = function help() {
  console.log('\n  ' + _chalk2.default.bold('ida build') + '\n\n  ' + _chalk2.default.dim('Examples:') + '\n\n  ' + _chalk2.default.gray('-') + ' Build current project:\n\n    ' + _chalk2.default.cyan('$ ida build') + '\n\n    ' + _chalk2.default.dim('Will build the project and output the finished site in folder "[project root]/_site".') + '\n  ');
};

var exit = function exit(code) {
  setTimeout(function () {
    return process.exit(code || 0);
  }, 100);
};

var getSettings = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(folder) {
    var content;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _asyncFs2.default.readFile((0, _path.resolve)(folder, _constants2.default.SETTINGS_FILE), 'utf8');

          case 3:
            content = _context.sent;
            return _context.abrupt('return', JSON.parse(content));

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);
            throw new Error(_constants2.default.SETTINGS_FILE + ' not found in folder ' + folder + '.');

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function getSettings(_x) {
    return _ref.apply(this, arguments);
  };
}();

var prepareLayout = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(projectFolder, settings) {
    var layoutDir, layoutData, files, promises, i, file, allTemplates, assetsDir;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            layoutDir = void 0;

            if (settings.theme) {
              layoutDir = (0, _path.resolve)(projectFolder, _constants2.default.THEMES_DIR, settings.theme);
            } else {
              layoutDir = (0, _path.resolve)(projectFolder, _constants2.default.LAYOUT_DIR);
            }

            _context2.next = 4;
            return (0, _isDirectory2.default)(layoutDir);

          case 4:
            if (_context2.sent) {
              _context2.next = 6;
              break;
            }

            throw new Error((settings.theme ? 'Theme "' + settings.theme + '"' : 'Layout') + ' not found.');

          case 6:

            _helpers2.default.forEach(function (helper) {
              _handlebars2.default.registerHelper(helper.name, helper.func);
            });

            layoutData = {};
            _context2.next = 10;
            return (0, _getAllFiles2.default)((0, _path.resolve)(layoutDir, _constants2.default.TEMPLATES_DIR));

          case 10:
            files = _context2.sent;
            promises = [];

            for (i = 0; i < files.length; ++i) {
              file = files[i];

              promises.push(_asyncFs2.default.readFile(file, 'utf8'));
            }
            _context2.next = 15;
            return _promise2.default.all(promises);

          case 15:
            _context2.t0 = function (fileContent, i) {
              var template = _handlebars2.default.compile(fileContent);
              var fileInfo = (0, _path.parse)(files[i]);
              var name = fileInfo.name;
              var relPath = (0, _path.relative)((0, _path.resolve)(layoutDir, _constants2.default.TEMPLATES_DIR), fileInfo.dir);
              var path = (0, _path.relative)(projectFolder, fileInfo.dir);
              var isPartial = path.endsWith(_constants2.default.PARTIALS_DIR);

              if (isPartial) {
                _handlebars2.default.registerPartial(name, template);
              }

              return {
                template: template,
                name: name,
                path: path,
                relPath: relPath,
                isPartial: isPartial
              };
            };

            allTemplates = _context2.sent.map(_context2.t0);


            layoutData.partials = allTemplates.filter(function (t) {
              return t.isPartial;
            });
            layoutData.templates = allTemplates.filter(function (t) {
              return !t.isPartial;
            });

            assetsDir = (0, _path.resolve)(layoutDir, _constants2.default.ASSETS_DIR);
            _context2.next = 22;
            return (0, _isDirectory2.default)(assetsDir);

          case 22:
            if (!_context2.sent) {
              _context2.next = 24;
              break;
            }

            layoutData.assetsDir = assetsDir;

          case 24:
            return _context2.abrupt('return', layoutData);

          case 25:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function prepareLayout(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var copyAssets = function () {
  var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(assetDir, projectDir) {
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _denodeify2.default)(_copyDir2.default)(assetDir, (0, _path.resolve)(projectDir, _constants2.default.OUTPUT_DIR, 'assets'));

          case 2:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function copyAssets(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

var parseFileContent = function parseFileContent(fileContent) {
  fileContent = fileContent.trim();
  var parsedContent = { config: null, html: null, error: null };

  if (fileContent.startsWith('{')) {
    try {
      var config = getConfigFromFileContent(fileContent);
      parsedContent.config = JSON.parse(config);
      fileContent = fileContent.substr(config.length);
    } catch (err) {
      parsedContent.error = err;
    }
  }

  parsedContent.html = (0, _marked2.default)(fileContent.trim());

  return parsedContent;
};

var getConfigFromFileContent = function getConfigFromFileContent(fileContent) {
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
};

var collectContent = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(root) {
    var contentRoot, files, promises, i, file, fileContents, content, _i, fileObj, contentItem;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            contentRoot = (0, _path.resolve)(root, _constants2.default.CONTENT_DIR);
            _context4.next = 3;
            return (0, _getAllFiles2.default)(contentRoot);

          case 3:
            files = _context4.sent;
            promises = [];

            for (i = 0; i < files.length; ++i) {
              file = files[i];

              promises.push(_asyncFs2.default.readFile(file, 'utf8'));
            }
            _context4.next = 8;
            return _promise2.default.all(promises);

          case 8:
            fileContents = _context4.sent;
            content = [];
            _i = 0;

          case 11:
            if (!(_i < fileContents.length)) {
              _context4.next = 20;
              break;
            }

            fileObj = (0, _path.parse)(files[_i]);

            if (!ignoreFiles.includes(fileObj.name)) {
              _context4.next = 15;
              break;
            }

            return _context4.abrupt('continue', 17);

          case 15:
            contentItem = parseFileContent(fileContents[_i]);

            if (!contentItem.error) {
              content.push({
                name: fileObj.name,
                path: (0, _path.relative)(contentRoot, fileObj.dir),
                html: contentItem.html,
                config: contentItem.config
              });
            } else {
              console.error(_chalk2.default.red('\nFailed to parse file "' + fileObj.basename + '" in folder "' + fileObj.dir + '". \nError: ' + contentItem.error + '.'));
            }

          case 17:
            ++_i;
            _context4.next = 11;
            break;

          case 20:
            return _context4.abrupt('return', content);

          case 21:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function collectContent(_x6) {
    return _ref4.apply(this, arguments);
  };
}();

var getTemplate = function getTemplate(content, templates) {
  var matchingTemplates = templates.filter(function (t) {
    return t.relPath === content.path;
  });
  if (matchingTemplates.length === 1) {
    return matchingTemplates[0].template;
  } else if (matchingTemplates.length > 1) {
    return matchingTemplates[0].template; // TODO
  }

  return null;
};

var getOutputFile = function getOutputFile(outputDir, content, settings) {
  var outputFile = void 0;
  if (content.path.startsWith(_constants2.default.POSTS_DIR)) {
    var nameParts = content.name.split('--');
    var name = nameParts.pop();
    outputFile = (0, _path.resolve)(outputDir, 'posts', settings.prettyUrls ? name : name + '.html', settings.prettyUrls ? 'index.html' : '');
  } else {
    if (content.name === 'index' || !settings.prettyUrls) {
      outputFile = (0, _path.resolve)(outputDir, content.path, content.name + '.html');
    } else {
      outputFile = (0, _path.resolve)(outputDir, content.path, content.name, 'index.html');
    }
  }

  return outputFile;
};

var getContentItem = function getContentItem(item, settings) {
  var nameParts = item.name.split('--');
  var url = getOutputFile('/', item, settings);

  return {
    author: settings.author,
    content: item.html,
    date: nameParts.length > 1 ? nameParts.shift() : null,
    title: item.config ? item.config.title : '',
    categories: item.config && item.config.categories ? item.config.categories : [],
    tags: item.config && item.config.tags ? item.config.tags : [],
    url: settings.prettyUrls ? (0, _path.parse)(url).dir : url
  };
};

var generateSite = function () {
  var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(outputDir, content, templates, settings) {
    var context, i, item, template, outputFile;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            context = {
              build: {
                date: new Date()
              },
              site: {
                title: settings.title,
                description: settings.description,
                author: settings.author,
                language: settings.language,
                url: settings.url
              },
              posts: content.filter(function (item) {
                return item.path.startsWith(_constants2.default.POSTS_DIR);
              }).map(function (item) {
                return getContentItem(item, settings);
              }).reverse(),
              current: null
            };
            i = 0;

          case 2:
            if (!(i < content.length)) {
              _context5.next = 15;
              break;
            }

            item = content[i];
            template = getTemplate(item, templates);

            if (!template) {
              _context5.next = 12;
              break;
            }

            context.current = getContentItem(item, settings);
            outputFile = getOutputFile(outputDir, item, settings);
            _context5.next = 10;
            return (0, _denodeify2.default)(_mkdirp2.default)((0, _path.parse)(outputFile).dir);

          case 10:
            _context5.next = 12;
            return _asyncFs2.default.writeFile(outputFile, template(context), 'utf8');

          case 12:
            ++i;
            _context5.next = 2;
            break;

          case 15:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function generateSite(_x7, _x8, _x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

var build = function () {
  var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(path) {
    var settings, layout, content;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return getSettings(path);

          case 2:
            settings = _context6.sent;
            _context6.next = 5;
            return prepareLayout(path, settings);

          case 5:
            layout = _context6.sent;
            _context6.next = 8;
            return collectContent(path);

          case 8:
            content = _context6.sent;
            _context6.next = 11;
            return copyAssets(layout.assetsDir, path);

          case 11:
            _context6.next = 13;
            return generateSite((0, _path.resolve)(path, _constants2.default.OUTPUT_DIR + '_temp'), content, layout.templates, settings);

          case 13:
            return _context6.abrupt('return', true);

          case 14:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function build(_x11) {
    return _ref6.apply(this, arguments);
  };
}();

if (argv.help) {
  help();
  exit(0);
} else {
  build(process.cwd()).then(function (success) {
    if (success) {
      console.log(_chalk2.default.bold.green('Project built successfully!'));
    } else {
      console.log(_chalk2.default.bold.yellow('Could not build project.'));
    }
  }).catch(function (err) {
    console.log(_chalk2.default.bold.red('Failed to build project.'));
    if (IS_DEV) {
      console.log(_chalk2.default.red(err));
    }
  });
}

// function build(outputDir, content, settings, templates) {
//   const context = createContext(content, settings);

//   return co(function *() {
//     yield clearFolder(outputDir);

//     let createdFolders = [];

//     for(let i = 0; i < content.length; ++i) {
//       let item = content[i];

//       if (item.error) {
//         console.error(item.error);
//         return;
//       }

//       let newFolders = yield createOutputFolders(outputDir, item.folders, createdFolders);
//       createdFolders = createdFolders.concat(newFolders);

//       let current = getCurrentItemFromContext(context, item);
//       if (!current) {
//         continue;
//       }

//       let filePath = null;
//       let fileName = null;
//       let path = item.folders.join('/');
//       if (settings.prettyUrls && item.name !== 'index') {
//         yield createFolder(`${outputDir}/${path}`, current.slug);
//         filePath = `${path}/${current.slug}`;
//         fileName = 'index.html';
//       } else {
//         filePath = path;
//         fileName = `${current.slug}.html`;
//       }

//       const template = getTemplate(item, templates);
//       context.current = current;
//       yield createFile(`${outputDir}/${filePath}`, fileName, template(context))
//     }
//   })
//   .catch(function (err) {
//     console.error(err);
//     return false;
//   });
// }

// function createOutputFolders(outputDir, folders, alreadyCreated) {
//   return co(function *() {
//     let path = '';
//     let createdFolders = [];
//     for(let i = 0; i < folders.length; ++i) {
//       let folder = folders[i];

//       if (!alreadyCreated.includes(`${path}/${folder}`)) {
//         yield createFolder(`${outputDir}/${path}`, folder);
//         path += `/${folder}`;
//         createdFolders.push(path);
//       }
//     }

//     return createdFolders;
//   });
// }

// function getCurrentItemFromContext(context, item) {
//   let parent = context;
//   for(let i = 0; i < item.folders.length; ++i) {
//     let folder = item.folders[i];
//     if (parent[folder]) {
//       parent = parent[folder];
//     }
//   }

//   return parent[item.name];
// }

// function getTemplate(item, templates) {
//   let template = templates.index;
//   let parts = item.folders;
//   if (item.config.layout) {
//     parts = item.config.layout.split('/');
//     template = templates;
//     parts.forEach(part => {
//       if (template[part]) {
//         template = template[part];
//       }
//     });
//   } else {
//     let parent = templates;
//     item.folders.forEach(folder => {
//       if (parent[folder]) {
//         parent = parent[folder];
//       }

//       if (parent.single) {
//         template = parent.single;
//       } else if (parent[item.name]) {
//         template = parent[item.name];
//       } else if (parent.index) {
//         template = parent.index;
//       }
//     });
//   }

//   if (typeof(template) !== 'function') {
//     throw new Error(`Invalid layout for content ${item.name} in content/${item.folders.length ? item.folders.join('/') : ''}.`);
//   }
//   return template;
// }