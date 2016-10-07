'use strict'

import {resolve} from 'path'
import fs from './async-fs'

export default async function (folder, file) {
  try {
    const content = await fs.readFile(resolve(folder, file), 'utf8')
    return JSON.parse(content)
  } catch (err) {
    throw new Error(`${file} not found in folder ${folder}.`)
  }
}