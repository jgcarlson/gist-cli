const { prompt } = require('inquirer');

const questions = [
  {
    type : 'input',
    name : 'username',
    message : 'Enter your Github username:'
  },
  {
    type : 'input',
    name : 'token',
    message : 'Enter your OAuth token:'
  }
]

module.exports = () => prompt(questions);
