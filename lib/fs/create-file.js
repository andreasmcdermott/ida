'use strict'

import {resolve} from 'path'
import fs from './async-fs'

export default async function (path, file, data) {
  await fs.writeFile(resolve(path, file), data, 'utf8')
}
