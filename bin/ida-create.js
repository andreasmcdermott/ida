#!/usr/bin/env node
'use strict'

import {resolve, basename} from 'path'
import del from 'del'
import chalk from 'chalk'
import minimist from 'minimist'
import confirm from '../lib/input/confirm'
import createFile from '../lib/fs/create-file'
import createFolder from '../lib/fs/create-folder'
import exists from '../lib/fs/exists'
import isEmpty from '../lib/fs/is-empty'
import createReadme from '../lib/create/readme'
import prompt from '../lib/input/prompt'

const argv = minimist(process.argv.slice(2), {
  alias: {
    help: ['h'],
    force: ['f']
  }
})

const help = () => {
  console.log(`
  ${chalk.bold('ida create')} [name]

  ${chalk.dim('Options:')}

    -h, --help         Output usage information
    -f, --force        Will delete all files if project folder already exists

  ${chalk.dim('Examples:')}

  ${chalk.gray('-')} Create new project in current directory:

    ${chalk.cyan('$ ida create')}

  ${chalk.gray('-')} Create new project in new folder:

    ${chalk.cyan('$ ida create new-project')}

    ${chalk.dim('Will create a new project in folder "./new-project"')}
  `)
}

const exit = code => {
  setTimeout(() => process.exit(code || 0), 100)
}

const create = async path => {
  if (!(await exists(path))) {
    await createFolder(path)
  } else if (!(await isEmpty(path)) && !argv.force) {
    const clearFolder = await confirm('Folder not empty. Delete all files?')
    if (!clearFolder) {
      return false
    }
  }

  await del([`${path}/**`, `!${path}`])

  const title = basename(path)
  const settings = await prompt([
    {name: 'title', message: 'Title', default: title},
    {name: 'description', message: 'Description', default: ''},
    {name: 'author', message: 'Author', default: ''},
    {name: 'language', message: 'Language', default: 'en'},
    {name: 'url', message: 'Url', default: `http://www.${title}.com`},
    {name: 'outputDir', message: 'Output directory', default: '_site'}
  ])

  await createFile(path, 'ida.json', JSON.stringify(settings, null, 2))
  await createFile(path, 'content.json', JSON.stringify({articles: [], pages: []}, null, 2))
  await createFile(path, 'README.md', createReadme(settings))
  await createFolder(path, settings.outputDir)
  await createFolder(path, settings.outputDir)

  return true
}

if (argv.help) {
  help()
  exit(0)
} else {
  let path = process.cwd()
  if (argv._[0]) {
    path = resolve(process.cwd(), argv._[0])
  }

  create(path).then(success => {
    if (success) {
      console.log(chalk.bold.green(`New project created in: ${path}`))
    } else {
      console.log(chalk.bold.yellow('Project not created.'))
    }
  }).catch(err => {
    console.log(chalk.bold.red('Failed to create project.'))
    console.log(chalk.red(err))
  })
}
