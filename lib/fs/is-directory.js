'use strict'

import fs from './async-fs'

export default async function isDirectory(path) {
  try {
    const stats = await fs.stat(path)
    return stats.isDirectory()
  } catch (err) {
    return false
  }
}