'use strict';

const co = require('co');
const fs = require('co-fs');
const getAllFiles = require('../fs/get_all_files');
const stripFolderAndExtension = require('../fs/strip_folder_and_extension');

module.exports = function (project_root, settings) {
  return co(function *() {
    const pathToLayout = settings.template ? 
      `${project_root}/templates/${settings.template}` :
      `${project_root}/layout`;
    
    const stats = yield fs.stat(pathToLayout);
    if (!stats.isDirectory()) {
      throw new Error(`"${pathToLayout}" exists, but is not a folder..? Weird.`)
    }

    const files = yield getAllFiles(pathToLayout);
    
    const partials = [];
    const templates = [];

    for(let i = 0; i < files.length; ++i) {
      const file = files[i];
      const fileContent = yield fs.readFile(file, 'utf8');
      const fileName = file.substr(pathToLayout.length + 1);

      if (fileName.startsWith('_partials')) {
        partials.push({
          name: stripFolderAndExtension(fileName),
          template: fileContent
        });
      } else {
        templates.push({
          folders: fileName.split('/').slice(0, -1),
          name: stripFolderAndExtension(fileName),
          template: fileContent
        });
      }
    }

    return { partials, templates };
  })
  .catch(function (err) {
    if (settings.template) {
      throw new Error(`Couldn't find template "${settings.template}" in folder "${project_root}/templates.`);
    } else {
      throw new Error(`Couldn't find folder "${project_root}/layout".`);
    }
  });
};