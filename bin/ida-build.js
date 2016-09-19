#!/usr/bin/env node
'use strict'

import {resolve} from 'path'
import minimist from 'minimist'
import chalk from 'chalk'
import copyDir from 'copy-dir'
import toPromise from 'denodeify'
import fs from '../lib/fs/async-fs'
import exists from '../lib/fs/exists'
import constants from '../lib/constants'

const IS_DEV = process.env.NODE_ENV === 'development'
const argv = minimist(process.argv.slice(2), {
  alias: {
    help: ['h']
  }
})

const help = () => {
  console.log(`
  ${chalk.bold('ida build')}

  ${chalk.dim('Examples:')}

  ${chalk.gray('-')} Build current project:

    ${chalk.cyan('$ ida build')}

    ${chalk.dim('Will build the project and output the finished site in folder "[project root]/_site".')}
  `)
}

const exit = code => {
  setTimeout(() => process.exit(code || 0), 100)
}

const getSettings = async folder => {
  try {
    const content = await fs.readFile(resolve(folder, constants.SETTINGS_FILE), 'utf8')
    return JSON.parse(content)
  } catch (err) {
    throw new Error(`${constants.SETTINGS_FILE} not found in folder ${folder}.`)
  }
}

const prepareLayout = async projectFolder => {
  return {}
}

const copyAssets = async (assetDir, projectDir) => {
  await toPromise(copyDir)(assetDir, resolve(projectDir, constants.OUTPUT_DIR, 'assets'))
}

const build = async path => {
  const settings = await getSettings(path)
  const layout = await prepareLayout(path)
  await copyAssets(layout.assetDir, path)


  return true
}

if (argv.help) {
  help()
  exit(0)
} else {
  build(process.cwd()).then(success => {
    if (success) {
      console.log(chalk.bold.green(`Project built successfully!`))
    } else {
      console.log(chalk.bold.yellow(`Could not build project.`))
    }
  }).catch(err => {
    console.log(chalk.bold.red(`Failed to build project.`))
    if (IS_DEV) {
      console.log(chalk.red(err))
    }
  })
}

//     const content = yield get_content(path);
//     yield build(outputDir, content, settings, prepareTemplates(layout.templates, layout.partials));

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