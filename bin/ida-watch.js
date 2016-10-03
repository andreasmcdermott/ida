'use strict'

import fs from 'fs'
import build from './build'

export default function watch() {
  const ignored = [
    'package.json',
    'readme.md',
    '.git',
    '.gitignore'
  ]
  const path = process.cwd()
  fs.watch(path, {recursive: true}, (eventType, fileName) => {
    if (ignored.every(path => !fileName.toLowerCase().startsWith(path))) {
      build()
      console.log('Updated!')
    }
  })
}
