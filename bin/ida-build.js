#!/usr/bin/env node
'use strict'

import {resolve, parse, relative} from 'path'
import minimist from 'minimist'
import chalk from 'chalk'
import copyDir from 'copy-dir'
import toPromise from 'denodeify'
import Handlebars from 'handlebars'
import marked from 'marked'
import moment from 'moment'
import mkdirp from 'mkdirp'
import fs from '../lib/fs/async-fs'
import isDirectory from '../lib/fs/is-directory'
import getAllFiles from '../lib/fs/get-all-files'
import readJson from '../lib/fs/read-json'
import hbsHelpers from '../lib/hbs/helpers'

const ignoreFiles = [
  '.DS_Store'
]

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

const build = async path => {
  const settings = await readJson(path, 'ida.json')
  const contentList = await readJson(path, 'content.json')
  //await copyAssets(layout.assetsDir, path)
  //await generateSite(resolve(path, `${settings.outputDir}_temp`), settings)

  return true
}

if (argv.help) {
  help()
  exit(0)
} else {
  build(process.cwd(), argv.dev).then(success => {
    if (success) {
      console.log(chalk.bold.green(`Project built successfully!`))
    } else {
      console.log(chalk.bold.yellow(`Could not build project.`))
    }
  }).catch(err => {
    console.log(chalk.bold.red(`Failed to build project.`))
    console.log(chalk.red(err))
  })
}

// const prepareLayout = async (projectFolder, settings) => {
//   let layoutDir
//   if (settings.theme) {
//     layoutDir = resolve(projectFolder, constants.THEMES_DIR, settings.theme)
//   } else {
//     layoutDir = resolve(projectFolder, constants.LAYOUT_DIR)
//   }

//   if (!await isDirectory(layoutDir)) {
//     throw new Error(`${settings.theme ? `Theme "${settings.theme}"` : 'Layout'} not found.`)
//   }

//   hbsHelpers.forEach(helper => {
//     Handlebars.registerHelper(helper.name, helper.func)
//   })

//   const layoutData = {}

//   const files = await getAllFiles(resolve(layoutDir, constants.TEMPLATES_DIR))
//   const promises = []
//   for (let i = 0; i < files.length; ++i) {
//     const file = files[i]
//     promises.push(fs.readFile(file, 'utf8'))
//   }
//   const allTemplates = (await Promise.all(promises)).map((fileContent, i) => {
//     const template = Handlebars.compile(fileContent)
//     const fileInfo = parse(files[i])
//     const name = fileInfo.name
//     const relPath = relative(resolve(layoutDir, constants.TEMPLATES_DIR), fileInfo.dir)
//     const path = relative(projectFolder, fileInfo.dir)
//     const isPartial = path.endsWith(constants.PARTIALS_DIR)

//     if (isPartial) {
//       Handlebars.registerPartial(name, template)
//     }

//     return {
//       template,
//       name,
//       path,
//       relPath,
//       isPartial
//     }
//   })

//   layoutData.partials = allTemplates.filter(t => t.isPartial)
//   layoutData.templates = allTemplates.filter(t => !t.isPartial)

//   const assetsDir = resolve(layoutDir, constants.ASSETS_DIR)
//   if (await isDirectory(assetsDir)) {
//     layoutData.assetsDir = assetsDir
//   }

//   return layoutData
// }

// const copyAssets = async (assetDir, projectDir) => {
//   await toPromise(copyDir)(assetDir, resolve(projectDir, constants.OUTPUT_DIR, 'assets'))
// }

// const parseFileContent = fileContent => {
//   fileContent = fileContent.trim()
//   const parsedContent = {config: null, html: null, error: null}

//   if (fileContent.startsWith('{')) {
//     try {
//       const config = getConfigFromFileContent(fileContent)
//       parsedContent.config = JSON.parse(config)
//       fileContent = fileContent.substr(config.length)
//     } catch (err) {
//       parsedContent.error = err
//     }
//   }

//   parsedContent.html = marked(fileContent.trim())

//   return parsedContent
// }

// const getConfigFromFileContent = fileContent => {
//   let open = 0

//   for (let i = 0; i < fileContent.length; ++i) {
//     if (fileContent[i] === '{') {
//       ++open
//     } else if (fileContent[i] === '}') {
//       --open

//       if (open === 0) {
//         return fileContent.substr(0, i + 1)
//       }
//     }
//   }

//   throw new Error('Invalid JSON.')
// }

// const collectContent = async root => {
//   const contentRoot = resolve(root, constants.CONTENT_DIR)
//   const files = await getAllFiles(contentRoot)
//   let promises = []
//   for (let i = 0; i < files.length; ++i) {
//     const file = files[i]
//     promises.push(fs.readFile(file, 'utf8'))
//   }
//   let fileContents = await Promise.all(promises)
//   let content = []
//   for (let i = 0; i < fileContents.length; ++i) {
//     let fileObj = parse(files[i])
//     if (ignoreFiles.includes(fileObj.name)) {
//       continue
//     }
    
//     let contentItem = parseFileContent(fileContents[i])
//     if (!contentItem.error) {
//       content.push({
//         name: fileObj.name,
//         path: relative(contentRoot, fileObj.dir),
//         html: contentItem.html,
//         config: contentItem.config
//       })
//     } else {
//       console.error(chalk.red(`
// Failed to parse file "${fileObj.basename}" in folder "${fileObj.dir}". 
// Error: ${contentItem.error}.`))
//     }
//   }

//   return content
// }

// const getTemplate = (content, templates) => {
//   const matchingTemplates = templates.filter(t => t.relPath === content.path)
//   if (matchingTemplates.length === 1) {
//     return matchingTemplates[0].template
//   } else if (matchingTemplates.length > 1) {
//     return matchingTemplates[0].template // TODO
//   }

//   return null
// }

// const getOutputFile = (outputDir, content, settings) => {
//   let outputFile
//   if (content.path.startsWith(constants.POSTS_DIR)) {
//     const nameParts = content.name.split('--')
//     const name = nameParts.pop()
//     outputFile = resolve(outputDir, 
//                          'posts', 
//                          settings.prettyUrls ? name : `${name}.html`,
//                          settings.prettyUrls ? 'index.html' : '')
//   } else {
//     if (content.name === 'index' || !settings.prettyUrls) {
//       outputFile = resolve(outputDir, content.path, `${content.name}.html`)
//     } else {
//       outputFile = resolve(outputDir, content.path, content.name, 'index.html')
//     }
//   }

//   return outputFile
// }

// const getContentItem = (item, settings) => {
//   const nameParts = item.name.split('--')
//   const url = getOutputFile('/', item, settings)

//   return {
//     author: settings.author,
//     content: item.html,
//     date: nameParts.length > 1 ? nameParts.shift() : null,
//     title: item.config ? item.config.title : '',
//     categories: item.config && item.config.categories ? item.config.categories : [],
//     tags: item.config && item.config.tags ? item.config.tags : [],
//     url: settings.prettyUrls ? parse(url).dir : url
//   }
// }

// const generateSite = async (outputDir, content, templates, settings) => {
//   const context = {
//     build: {
//       date: new Date()
//     },
//     site: {
//       title: settings.title,
//       description: settings.description,
//       author: settings.author,
//       language: settings.language,
//       url: settings.url
//     },
//     posts: content.filter(item => item.path.startsWith(constants.POSTS_DIR))
//                   .map(item => getContentItem(item, settings))
//                   .reverse(),
//     current: null
//   }

//   for (let i = 0; i < content.length; ++i) {
//     const item = content[i]
//     const template = getTemplate(item, templates)
//     if (template) {
//       context.current = getContentItem(item, settings)
//       const outputFile = getOutputFile(outputDir, item, settings)

//       await toPromise(mkdirp)(parse(outputFile).dir)
//       await fs.writeFile(outputFile, template(context), 'utf8')
//     }
//   }
// }

// ---------------

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
