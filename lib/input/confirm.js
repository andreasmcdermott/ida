'use strict'

import inquirer from 'inquirer'

export default async function confirm(question) {
  return await doConfirm(question)
}

function doConfirm(question) {
  return new Promise(resolve => {
    inquirer.prompt([{
      message: question,
      name: 'answer'
    }]).then(answers => {
      resolve(/^y|yes|okay|ok|true$/i.test(answers.answer))
    })
  })
}
