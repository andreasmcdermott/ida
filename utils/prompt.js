'use strict';

const inquirer = require('inquirer');

module.exports = function (questions) {
  return new Promise((resolve, reject) => {
    inquirer.prompt(questions).then(answers => {
      resolve(answers);
    });
  });
}
