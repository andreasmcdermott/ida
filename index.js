#!/usr/bin/env node
'use strict';

const Argumenter = require('./lib/argumenter');
const argumenter = new Argumenter();

argumenter.on('create', require('./commands/create'));
argumenter.on('build', require('./commands/build'));
argumenter.on('watch', require('./commands/watch'));
argumenter.on('help', require('./commands/help'));
argumenter.on('version', require('./commands/version'));

argumenter.dispatch(process.argv, { 
  default: 'build',
  alias: {
    'help': ['h'],
    'version': ['v'],
    'force': ['f']
  } 
});
