'use strict';

const co = require('co');
const fs = require('co-fs');

module.exports = function (project_root, settings) {
  return co(function *() {
    const pathToLayout = settings.template ? 
      `${project_root}/templates/${settings.template}` :
      `${project_root}/layout`;
    
    const stats = yield fs.stat(pathToLayout);
    if (!stats.isDirectory()) {
      throw new Error(`"${pathToLayout}" exists, but is not a folder..? Weird.`)
    }

    // TODO: Get layout files' content.
    return '';
  })
  .catch(function (err) {
    if (settings.template) {
      throw new Error(`Couldn't find template "${settings.template}" in folder "${project_root}/templates.`);
    } else {
      throw new Error(`Couldn't find folder "${project_root}/layout".`);
    }
  });
};