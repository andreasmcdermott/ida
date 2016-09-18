'use strict'

import fs from 'fs'
import {resolve} from 'path'
import toPromise from 'denodeify'

export default async function createFolder() {
  await toPromise(fs.mkdir)(resolve(...arguments))
}
