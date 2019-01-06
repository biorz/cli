const program = require('commander')
const { cleanArgs } = require('../util')

program
  .command('list <app-name>')
  .description('Get a list of published plugins')
  .option('-s, --search', 'Search')
  .option('-r, --registry <url>', 'Use specified npm registry when installing dependencies (only for npm)')
  .option('-x, --proxy', 'Use specified proxy when creating project')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)

    require('../library/query')(name, options)
  })