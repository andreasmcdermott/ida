'use strict'

import fs from 'fs'
import {resolve} from 'path'
import toPromise from 'denodeify'

export default async function (path, file, data) {
  await toPromise(fs.writeFile)(resolve(path, file), data, 'utf8')
}
