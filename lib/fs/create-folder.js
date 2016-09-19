'use strict'

import {resolve} from 'path'
import fs from './async-fs'

export default async function createFolder() {
  await fs.mkdir(resolve(...arguments))
}
