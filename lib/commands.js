#!/usr/bin/env node

const commander = require('commander');
const { version } = require('./../package.json');
const {
  validated,
  init,
  whoami,
  create,
  find } = require('./actions.js');


commander
  .version('GistCLI v' + version)
  .description('A CLI for gist.github.com.');

commander
  .command('setup')
  .description('Setup GistCLI.')
  .action(init);

if (validated()) {
  commander
    .command('whoami')
    .description('Check your Github username.')
    .action(whoami)

  commander
    .command('create <filename> <description> <gist>')
    .alias('c')
    .description('Create a gist.')
    .action(create)

  commander
    .command('find <query>')
    .alias('f')
    .description('Find a gist.')
    .action(find)

  commander.on('--help', () => {
    console.log('\n  Examples:');
    console.log('');
    console.log('    $ gist create example.js "An example gist." "const a = b + c;"');
    console.log('    $ gist find "vertical centering"');
    console.log('    $ gist f css');
    console.log('');
  });
} else {
  console.log('Run `gist setup` and enter your Github username and access token to get started.');
}

commander.parse(process.argv);
