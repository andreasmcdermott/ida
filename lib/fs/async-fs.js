'use strict'

import fs from 'fs'
import toPromise from 'denodeify'

const methods = [
  'stat',
  'mkdir',
  'writeFile',
  'readFile',
  'readdir'
]
const asyncFs = {}

methods.forEach(method => {
  asyncFs[method] = toPromise(fs[method])
})

export default asyncFs
