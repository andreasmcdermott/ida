'use strict';

const co = require('co');
const fs = require('co-fs');
const getAllFiles = require('../fs/get_all_files');
const stripFolderAndExtension = require('../fs/strip_folder_and_extension');
const stripFolders = require('../fs/strip_folders');

module.exports = function (projectRoot, settings) {
  return co(function *() {
    const pathToLayout = settings.template ? 
      `${projectRoot}/templates/${settings.template}` :
      `${projectRoot}/layout`;

    const stats = yield fs.stat(pathToLayout);
    if (!stats.isDirectory()) {
      throw new Error(`"${pathToLayout}" exists, but is not a folder..? Weird.`)
    }

    const files = yield getAllFiles(pathToLayout);    
    const partials = [];
    const templates = [];
    let hasAssets = false

    for(let i = 0; i < files.length; ++i) {
      const file = files[i];
      const fileName = file.substr(pathToLayout.length + 1);

      if (fileName.startsWith('assets')) {
        hasAssets = true;
        continue;
      } else if (!fileName.startsWith('templates')) {
        continue;
      }

      const folders = fileName.split('/').slice(1, -1);
      const fileContent = yield fs.readFile(file, 'utf8');

      if (folders[0] === '_partials') {
        partials.push({
          name: stripFolderAndExtension(fileName),
          template: fileContent
        });
      } else {
        templates.push({
          folders: folders,
          name: stripFolderAndExtension(fileName),
          template: fileContent
        });
      }
    }

    return { partials, templates, assetsDir: hasAssets ? `${pathToLayout}/assets` : null };
  })
  .catch(function (err) {
    if (settings.template) {
      throw new Error(`Couldn't find template "${settings.template}" in folder "${project_root}/templates.`);
    } else {
      throw new Error(`Couldn't find folder "${project_root}/layout".`);
    }
  });
};