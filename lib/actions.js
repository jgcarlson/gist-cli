const commander = require('commander');
const { prompt } = require('inquirer');
const { version } = require('./../package.json');
const request = require('request-promise');
const dayjs = require('dayjs');
const chalk = require('chalk');
const highlight = require('cli-highlight').highlight
const setup = require('./inquirer.js');
const fs = require('fs');

const token = () => {
  const data = fs.readFileSync('lib/.env', 'utf8') || '{}';
  return JSON.parse(data).token || '';
};
const username = () => {
  const data = fs.readFileSync('lib/.env', 'utf8') || '{}';
  return JSON.parse(data).username || '';
};
const validated = () => !!token();
const headers = {
  'User-Agent': 'Gist-CLI',
  'Authorization': `token ${token()}`,
  'X-OAuth-Scopes': 'user, repo, gist',
  'X-Accepted-OAuth-Scopes': 'user, repo, gist'
};
const options = {
  uri: `https://api.github.com/gists`,
  headers,
  json: true
};
const getGist = async (url, method) => {
  return await request({
    uri: url,
    method,
    headers,
    json: true
  })
};
const date = (createdAt, updatedAt) => {
  return createdAt === updatedAt ?
    `Created ${dayjs(createdAt).format('MM/DD/YYYY [at] HH:mma')}` :
    `Created ${dayjs(createdAt).format('MM/DD/YYYY [at] HH:mma')}\nUpdated ${dayjs(updatedAt).format('MM/DD/YYYY [at] HH:mma')}`;
};

// Initialize Github username and auth token
const init = async () => {
  const answer = await setup();
  fs.writeFile('lib/.env', JSON.stringify(answer), (err) => {
    if (err) throw err;
    console.log('You\'re all set!');
  });
};

const whoami = () => {
  fs.readFile('lib/.env', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('You are "' + JSON.parse(data).username + '".');
  });
};

const create = async (file, description, gist) => {
  options.method = 'POST';
  options.body = { description, files: {} };
  options.body.files[file] = { 'content': gist };
  try {
    const res = await request.post(options);
    console.log('Created gist successfully!');
    console.log(`You can find it at "${res.html_url}".`)
  } catch (e) {
    console.log('ERROR:', e);
  }
};

const find = async (query) => {
  options.method = 'GET';
  try {
    let item;
    const matches = [];
    const res = await request(options);
    res.map(i => {
      const keyMap = Object.keys(i.files);
      // console.log('DESC', i.description);
      if (i.description.toLowerCase().indexOf(query.toLowerCase()) > -1) {
        console.log('DESC', i.description);
        matches.push({
          name: i.description,
          value: {
            description: i.description,
            url: i.html_url,
            created: i.created_at,
            updated: i.updated_at,
            files: keyMap.map(k => i.files[k])
          }
        });
      } else {
        keyMap.map(f => {
          if (f.toLowerCase().indexOf(query.toLowerCase()) > -1) {
            matches.push({
              name: `${i.description} (${f})`,
              value: {
                description: i.description,
                url: i.html_url,
                created: i.created_at,
                updated: i.updated_at,
                files: keyMap.map(k => i.files[k])
              }
            });
          }
        })
      }
    });
    if (matches.length === 0) {
      console.log('No matches.');
    } else if (matches.length === 1) {
      item = matches[0].value;
    } else {
      const { gist } = await prompt([{
          type : 'list',
          name : 'gist',
          message : 'Which gist are you looking for?',
          choices: matches
        }]);
      item = gist;
    }
    console.log(
      chalk.green(
        '\n' + chalk.blue.bold(item.description),
        '\n' + chalk.underline(item.url),
        '\n' + date(item.created, item.updated)
      )
    );
    item.files.map(async e => {
      const title = `\n---------------- ${chalk.underline.greenBright.bold(e.filename)} ----------------\n`;
      const base = '\n' + '-'.repeat(title.length - 30);
      const content = await getGist(e.raw_url, 'GET');
      let formatted;
      try {
        formatted = highlight(content , { language: e.language, ignoreIllegals: true });
      } catch (e) {
        formatted = content;
      }
      console.log(chalk.blue(title) + formatted + chalk.blue(base));
    });
  } catch (e) {
    console.log('ERROR:', e);
  }
};

module.exports = {
  validated,
  init,
  whoami,
  create,
  find
};
