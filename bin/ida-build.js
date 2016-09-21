#!/usr/bin/env node
'use strict'

import {resolve, parse, relative} from 'path'
import minimist from 'minimist'
import chalk from 'chalk'
import copyDir from 'copy-dir'
import toPromise from 'denodeify'
import Handlebars from 'handlebars'
import marked from 'marked'
import fs from '../lib/fs/async-fs'
import isDirectory from '../lib/fs/is-directory'
import getAllFiles from '../lib/fs/get-all-files'
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

const prepareLayout = async (projectFolder, settings) => {
  let layoutDir
  if (settings.theme) {
    layoutDir = resolve(projectFolder, constants.THEMES_DIR, settings.theme)
  } else {
    layoutDir = resolve(projectFolder, constants.LAYOUT_DIR)
  }

  if (!await isDirectory(layoutDir)) {
    throw new Error(`${settings.theme ? `Theme "${settings.theme}"` : 'Layout'} not found.`)
  }

  const layoutData = {}

  const files = await getAllFiles(resolve(layoutDir, constants.TEMPLATES_DIR))
  const promises = []
  for (let i = 0; i < files.length; ++i) {
    const file = files[i]
    promises.push(fs.readFile(file, 'utf8'))
  }
  const allTemplates = (await Promise.all(promises)).map((fileContent, i) => {
    const template = Handlebars.compile(fileContent)
    const fileInfo = parse(files[i])
    const name = fileInfo.name
    const folders = relative(projectFolder, fileInfo.dir).split('/')
    const isPartial = folders[folders.length - 1] === constants.PARTIALS_DIR
    return {
      template,
      name,
      folders,
      isPartial
    }
  })

  layoutData.partials = allTemplates.filter(t => t.isPartial)
  layoutData.templates = allTemplates.filter(t => !t.isPartial)

  const assetsDir = resolve(layoutDir, constants.ASSETS_DIR)
  if (await isDirectory(assetsDir)) {
    layoutData.assetsDir = assetsDir
  }

  return layoutData
}

const copyAssets = async (assetDir, projectDir) => {
  await toPromise(copyDir)(assetDir, resolve(projectDir, constants.OUTPUT_DIR, 'assets'))
}

const parseFileContent = fileContent => {
  fileContent = fileContent.trim()
  const parsedContent = {config: null, html: null, error: null}

  if (fileContent.startsWith('{')) {
    try {
      const config = getConfigFromFileContent(fileContent)
      parsedContent.config = JSON.parse(config)
      fileContent = fileContent.substr(config.length)
    } catch (err) {
      parsedContent.error = err
    }
  }

  parsedContent.html = marked(fileContent.trim())

  return parsedContent
}

const getConfigFromFileContent = fileContent => {
  let open = 0

  for (let i = 0; i < fileContent.length; ++i) {
    if (fileContent[i] === '{') {
      ++open
    } else if (fileContent[i] === '}') {
      --open

      if (open === 0) {
        return fileContent.substr(0, i + 1)
      }
    }
  }

  throw new Error('Invalid JSON.')
}

const collectContent = async root => {
  const contentRoot = resolve(root, constants.CONTENT_DIR)
  const files = await getAllFiles(contentRoot)
  let promises = []
  for (let i = 0; i < files.length; ++i) {
    const file = files[i]
    promises.push(fs.readFile(file, 'utf8'))
  }
  let fileContents = await Promise.all(promises)
  let content = []
  for (let i = 0; i < fileContents.length; ++i) {
    let fileObj = parse(files[i])
    let contentItem = parseFileContent(fileContents[i])
    if (!contentItem.error) {
      content.push({
        name: fileObj.name,
        path: relative(contentRoot, fileObj.dir),
        html: contentItem.html,
        config: contentItem.config
      })
    } else {
      console.error(chalk.red(`
Failed to parse file "${fileObj.basename}" in folder "${fileObj.dir}". 
Error: ${contentItem.error}.`))
    }
  }

  return content
}

const build = async path => {
  const settings = await getSettings(path)
  const layout = await prepareLayout(path, settings)
  const content = await collectContent(path)
  await copyAssets(layout.assetsDir, path)

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
