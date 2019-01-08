const program = require('commander')
const { cleanArgs } = require('../util')

program
  .command('list')
  .description('Get a list of published plugins')
  .option('-s, --search', 'Search plugins')
  .option('-i, --install', 'Select and install plugins')
  .action((cmd) => {
    const options = cleanArgs(cmd)  
    
    require('../library/query')(options)
  })