#!/usr/bin/env node

'use strict';

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

var _asyncFs = require('../lib/fs/async-fs');

var _asyncFs2 = _interopRequireDefault(_asyncFs);

var _exists = require('../lib/fs/exists');

var _exists2 = _interopRequireDefault(_exists);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(projectFolder) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', {});

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function prepareLayout(_x2) {
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

  return function copyAssets(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var build = function () {
  var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(path) {
    var settings, layout;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getSettings(path);

          case 2:
            settings = _context4.sent;
            _context4.next = 5;
            return prepareLayout(path);

          case 5:
            layout = _context4.sent;
            _context4.next = 8;
            return copyAssets(layout.assetDir, path);

          case 8:
            return _context4.abrupt('return', true);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function build(_x5) {
    return _ref4.apply(this, arguments);
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

//     const content = yield get_content(path);
//     yield build(outputDir, content, settings, prepareTemplates(layout.templates, layout.partials));

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