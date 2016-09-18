'use strict'

import fs from 'fs'
import build from './build'

export default function watch() {
  const watched = [
    'content',
    'themes',
    'layout/templates',
    'layout/assets',
    'ida.json'
  ]
  const path = process.cwd()
  fs.watch(path, {recursive: true}, (eventType, fileName) => {
    if (watched.some(path => fileName.startsWith(path))) {
      build()
      console.log('Updated!')
    }
  })
}
