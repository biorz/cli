const program = require("commander");
const chalk = require("chalk");
const utils = require("../util");

utils
  .loadCommands(__dirname, "index.js")
  .then(() => {
    // Unknown command
    program.arguments("<command>").action(cmd => {
      program.outputHelp();
      console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(cmd)}.`));
      console.log();
    });
  })
  .then(() => {
    program.parse(process.argv);

    if (!process.argv.slice(2).length) {
      program.outputHelp();
    }
  });
