const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const creator = require("./creator");
const { error } = require('../../utils/logger')
const { clearConsole } = require("../../utils/clearConsole");
const validateProjectName = require("validate-npm-package-name");

async function create(projectName, options) {
  if (options.proxy) {
    process.env.HTTP_PROXY = options.proxy;
  }

  const cwd = options.cwd || process.cwd();
  const inCurrent = projectName === ".";
  const name = inCurrent ? path.relative("../", cwd) : projectName;
  const targetDir = path.resolve(cwd, projectName || ".");

  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`));
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.red(err));
      });
    process.exit(1);
  }

  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      await clearConsole();
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: "ok",
            type: "confirm",
            message: `G ?`
          }
        ]);
        if (!ok) {
          return;
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${chalk.cyan(
              targetDir
            )} already exists. Pick an action:`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Merge", value: "merge" },
              { name: "Cancel", value: false }
            ]
          }
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
        }
      }
    }
  }

  creator(name, targetDir, options);
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    error(err);
    process.exit(1);
  });
};
