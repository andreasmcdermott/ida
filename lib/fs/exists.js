'use strict'

import fs from './async-fs'

export default async function exists(path) {
  try {
    await fs.stat(path)
  } catch (err) {
    return false
  }

  return true
}
