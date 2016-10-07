#!/usr/bin/env node
'use strict'

import minimist from 'minimist'
import chalk from 'chalk'
import readJson from '../lib/fs/read-json'

const argv = minimist(process.argv.slice(2), {
  alias: {
    help: ['h']
  }
})

const exit = code => {
  setTimeout(() => process.exit(code || 0), 100)
}

const help = () => {
  console.log(`
  ${chalk.bold('ida new')} [article/page]

  ${chalk.dim('Options:')}

    -h, --help         Output usage information

  ${chalk.dim('Examples:')}

  ${chalk.gray('-')} Create new article:

    ${chalk.cyan('$ ida new article')}

  ${chalk.gray('-')} Create new page:

    ${chalk.cyan('$ ida new page')}
  `)
}

const newContent = async (path, type) => {
  const contentList = readJson(path, 'content.json')
  console.log(contentList[`${type}s`])
}

const logError = (type, err) => {
  console.log(chalk.bold.red(`Failed to create ${type}.`))
  if (err) {
    console.log(chalk.red(err))
  }
}

const types = new Set(['page', 'article'])

if (argv.help) {
  help()
  exit(0)
} else {
  const path = process.cwd()
  const type = argv._[0]

  if (types.has(type)) {
    newContent(path, type).then(success => {
      if (success) {
        console.log(chalk.bold.green(`New ${type} created in: ./${type}s`))
      } else {
        logError(type)
      }
    }).catch(err => {
      logError(type, err)
    })
  } else {
    console.log(chalk.bold.red(`Invalid content type. Received: "${type}".`))
  }
}
