#!/usr/bin/env node
'use strict';

const program = require('commander');
const co = require('co');
const fs = require('co-fs');
const confirm = require('./input/confirm');
const createProject = require('./commands/create_project');

program
  .option('-f, --force', 'clear folder if not empty')
  .parse(process.argv);

const projectName = program.args[0];
const path = getPath(projectName);

co(function *() {
  yield ensureFolderExists(path);
  const files = yield fs.readdir(path);
  if (files.length && !program.force) {
    const clearFolder = yield confirm('Folder not empty. Delete all files?');
    if (!clearFolder) {
      return false;
    }
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

function ensureFolderExists(path) {
  return co(function *() {
    const exists = yield fs.exists(path);
    if (exists) {
      const stats = yield fs.stat(path);
      if (!stats.isDirectory()) {
        throw new Error(`${path} exists, but is not a folder.`);
      }
    } else {
      yield fs.mkdir(path);
    }
  });
}

function onError(err) {
  console.error('Failed to create project.');
  console.error(err.message);
  //console.error(err.stack);
}
