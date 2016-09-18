#!/usr/bin/env node

'use strict';

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _crossSpawn = require('cross-spawn');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _constants = require('../lib/constants');

var _constants2 = _interopRequireDefault(_constants);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exit = function exit(code) {
  setTimeout(function () {
    return process.exit(code || 0);
  }, 100);
};

var isProjectDir = function isProjectDir() {
  try {
    _fs2.default.statSync((0, _path.resolve)(process.cwd(), _constants2.default.SETTINGS_FILE));
  } catch (err) {
    return false;
  }
  return true;
};

var version = function version() {
  console.log('\n  ' + _chalk2.default.bold('ida') + ' v' + _package2.default.version + '\n  ');
};

var help = function help() {
  console.log('\n  ' + _chalk2.default.bold('ida') + '\n\n  ' + _chalk2.default.dim('Commands:') + '\n\n    create [name]         Create a new project.             \n    build                 Generate the site.\n    watch                 Generate site on file change.\n    version               Current version.\n    help                  Output usage information.\n                          Use "ida <command> --help" for usage information about a specific command.\n  ');
};

var commands = new _set2.default(['test', 'build', 'create', 'watch', 'version', 'help']);
var defaultCommand = isProjectDir() ? 'build' : 'create';

var argv = (0, _minimist2.default)(process.argv.slice(2), {
  alias: {
    help: ['h'],
    version: ['v']
  }
});
var cmd = argv._[0];
var args = [];

if (cmd === 'help' || cmd === 'h') {
  help();
  exit();
} else if (cmd === 'version' || cmd === 'v') {
  version();
  exit();
} else {
  if (commands.has(cmd)) {
    args = args.concat(process.argv.slice(3));
  } else {
    cmd = defaultCommand;
    args = args.concat(process.argv.slice(2));
  }

  var bin = (0, _path.resolve)(__dirname, 'ida-' + cmd + '.js');
  var proc = (0, _crossSpawn.spawn)(bin, args, { stdio: 'inherit' });
  proc.on('close', function (code) {
    return exit(code);
  });
  proc.on('error', function () {
    return exit(1);
  });
}