#!/usr/bin/env node

'use strict';

console.log('build', process.argv);

// 'use strict';

// const co = require('co');
// const get_settings = require('./build.get_settings');
// const get_layout = require('./build.get_layout');
// const get_content = require('./build.get_content');
// const prepareTemplates = require('./build.prepare_templates');
// const createContext = require('./build.create_context');
// const clearFolder = require('../fs/clear_folder');
// const createFolder = require('../fs/create_folder');
// const createFile = require('../fs/create_file');
// const copyDir = require('copy-dir');

// module.exports = function () {
//   const path = process.cwd();
//   const outputDir = `${path}/_site`;

//   co(function *() {
//     const settings = yield get_settings(path);
//     const layout = yield get_layout(path, settings);
//     const content = yield get_content(path);

//     yield build(outputDir, content, settings, prepareTemplates(layout.templates, layout.partials));
//     if (layout.assetsDir) {
//       copyDir.sync(layout.assetsDir, `${outputDir}/assets`);
//     }

//     return true;
//   })
//   .catch(err => {
//     console.error('Failed to build project.');
//     console.error(err.message);
//     return false;
//   });
// };

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