'use strict'

import fs from 'fs'
import toPromise from 'denodeify'

export default async function exists(path) {
  try {
    await toPromise(fs.stat)(path)
  } catch (err) {
    return false
  }

  return true
}
