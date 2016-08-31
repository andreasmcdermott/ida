'use strict';

const EventEmitter = require('events');
const parseArgv = require('minimist');

module.exports = class Argumenter extends EventEmitter {
  dispatch(argv, opt) {
    opt = opt || {};
    const args = parseArgv(argv.slice(2), { alias: opt.alias || {} });

    if (args.help) {
      this.emit('help');
    } else if (args.version) {
      this.emit('version');
    } else {
      this.emit(args._.shift() || opt.default, args);
    }
  }
}