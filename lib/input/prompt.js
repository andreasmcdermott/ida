'use strict'

import inquirer from 'inquirer'

export default function prompt(questions) {
  return new Promise(resolve => {
    inquirer.prompt(questions).then(answers => {
      resolve(answers)
    })
  })
}
