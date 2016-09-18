'use strict'

import fs from 'fs'
import toPromise from 'denodeify'

export default async function isEmpty(path) {
  const files = await toPromise(fs.readdir)(path)
  return files.length === 0
}
