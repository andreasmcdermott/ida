#!/usr/bin/env node
'use strict'

import fs from 'fs'
import {resolve} from 'path'
import minimist from 'minimist'
import {spawn} from 'cross-spawn'
import chalk from 'chalk'
import constants from '../lib/constants'
import pkg from '../../package.json'

const exit = code => {
  setTimeout(() => process.exit(code || 0), 100)
}

const isProjectDir = () => {
  try {
    fs.statSync(resolve(process.cwd(), constants.SETTINGS_FILE))
  } catch (err) {
    return false
  }
  return true
}

const version = () => {
  console.log(`
  ${chalk.bold('ida')} v${pkg.version}
  `)
}

const help = () => {
  console.log(`
  ${chalk.bold('ida')}

  ${chalk.dim('Commands:')}

    create [name]         Create a new project.             
    build                 Generate the site.
    watch                 Generate site on file change.
    version               Current version.
    help                  Output usage information.
                          Use "ida <command> --help" for usage information about a specific command.
  `)
}

const commands = new Set(['test', 'build', 'create', 'watch', 'version', 'help'])
const defaultCommand = isProjectDir() ? 'build' : 'create'

const argv = minimist(process.argv.slice(2))
let cmd = argv._[0]
let args = []

if (cmd === 'help' || cmd === 'h') {
  help()
  exit()
} else if (cmd === 'version' || cmd === 'v') {
  version()
  exit()
} else {
  if (commands.has(cmd)) {
    args = args.concat(process.argv.slice(3))
  } else {
    cmd = defaultCommand
    args = args.concat(process.argv.slice(2))
  }

  const bin = resolve(__dirname, `ida-${cmd}.js`)
  const proc = spawn(bin, args, {stdio: 'inherit'})
  proc.on('close', code => exit(code))
  proc.on('error', () => exit(1))
}
