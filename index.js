#!/usr/bin/env node
'use strict';

const program = require('commander');
program
  .version('0.0.1')
  .command('create [name]', 'create new project structure')
  .command('build', 'build project', { isDefault: true })
  .parse(process.argv);
