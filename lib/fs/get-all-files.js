'use strict'

import {resolve} from 'path'
import fs from './async-fs'
import isDirectory from './is-directory'

export default async function getAllFiles(root) {
  if (!await isDirectory(root)) {
    throw new Error(`"${root}" exists, but is not a folder.`)
  }

  async function iterateFiles(subPath) {
    let allFiles = []
    const path = subPath ? resolve(root, subPath) : root
    const fileNames = await fs.readdir(path)
    let promises = fileNames.map(file => fs.stat(resolve(path, file)))
    const files = await Promise.all(promises)

    promises = []
    for (let i = 0; i < files.length; ++i) {
      const file = files[i]
      if (file.isFile()) {
        allFiles.push(resolve(path, fileNames[i]))
      } else if (file.isDirectory()) {
        promises.push(iterateFiles(resolve(path, fileNames[i])))
      }
    }
    if (promises.length) {
      (await Promise.all(promises)).forEach(files => {
        allFiles = allFiles.concat(files)
      })
    }

    return allFiles
  }

  return await iterateFiles()
}
