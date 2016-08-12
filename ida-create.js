#!/usr/bin/env node
'use strict';

const program = require('commander');
const co = require('co');
const fs = require('co-fs');
const utils = require('./utils/utils');
const createProject = require('./commands/create_project');

program
  .option('-f, --force', 'clear folder if not empty')
  .parse(process.argv);

const projectName = program.args[0];
const path = getPath(projectName);

co(function *() {
  yield utils.ensureFolderExists(path);
  const files = yield fs.readdir(path);
  if (files.length && !program.force) {
    const clearFolder = yield utils.confirm('Folder not empty. Delete all files?');
    if (!clearFolder) return false;
  }

  yield createProject(path, projectName);

  return true;
})
.then(result => console.log(result ? 'Project created!' : 'Project not created.'))
.catch(onError);

function getPath(projectName) {
  if (projectName) return `${process.cwd()}/${projectName}`;
  else return process.cwd();
}

function onError(err) {
  console.error('Failed to create project.');
  console.error(err.message);
  console.error(err.stack);
}
