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
import constants from '../lib/constants'

const IS_DEV = process.env.NODE_ENV === 'development'
const argv = minimist(process.argv.slice(2))
const force = argv.force || argv.f

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
  } else if (!(await isEmpty(path)) && !force) {
    const clearFolder = await confirm('Folder not empty. Delete all files?')
    if (!clearFolder) {
      return false
    }
  }

  await del([`${path}/**`, `!${path}`])

  const title = basename(path)
  const settings = {
    title,
    description: '',
    author: '',
    theme: '',
    prettyUrls: true,
    language: 'en',
    url: `http://www.${title}.com`
  }

  await createFile(path, constants.SETTINGS_FILE, JSON.stringify(settings, null, 2))
  await createFile(path, 'README.md', createReadme(settings.title))
  await createFolder(path, constants.OUTPUT_DIR)
  await createFolder(path, constants.THEMES_DIR)
  await createFolder(path, constants.CONTENT_DIR)
  await createFolder(path, constants.LAYOUT_DIR)
  await createFolder(path, constants.LAYOUT_DIR, constants.TEMPLATES_DIR)
  await createFolder(path, constants.LAYOUT_DIR, constants.ASSETS_DIR)

  return true
}

if (argv.help || argv.h) {
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
    if (IS_DEV) {
      console.log(chalk.red(err))
    }
  })
}
