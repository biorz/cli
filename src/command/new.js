const program = require('commander')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { cleanArgs } = require('../util')

program
  .command('new <app-name>')
  .description('create a new project powered by ymm design cli')
  .option('-d, --default', 'Skip prompts and use default preset')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  .option('-g, --git [message]', 'Force git initialization with initial commit message')
  .option('-n, --no-git', 'Skip git initialization')
  .option('-f, --force', 'Overwrite target directory if it exists')
  .option('-x, --proxy', 'Use specified proxy when creating project')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    // --no-git makes commander to default git to true
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }
    require('../library/create')(name, options)
  })