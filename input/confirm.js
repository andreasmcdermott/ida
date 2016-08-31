'use strict';

const inquirer = require('inquirer');

module.exports = function (question) {
  return new Promise((resolve, reject) => {
    inquirer.prompt([{
      message: question,
      name: 'answer'
    }]).then(answers => {
      resolve(/^y|yes|okay|ok|true$/i.test(answers.answer));
    });
  });
}
