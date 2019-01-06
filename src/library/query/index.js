const request = require("../../util/request");
const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { run, getPkgPath } = require("../../util");
const { warn, error} = require("../../util/logger");
const { hasYarn } = require("../../util/env");

class Query {
  constructor(options) {
    this.context = process.cwd();
    this.options = options;

    this.toInstall();
  }

  async toInstall() {
    const list = await this.getList();
    const choices = list.map(it => it);
    const { checkedList } = await inquirer.prompt([
      {
        name: "checkedList",
        type: "checkbox",
        message: "Please select the plugin you want to install",
        choices
      }
    ]);

    const pkgPath = getPkgPath(this.context);
    if (!pkgPath) {
      return warn("Could not find package.json");
    }

    const pkg = fs.readJsonSync(pkgPath);
    const { confirm } = await inquirer.prompt([
      {
        name: "confirm",
        message: `Confirm whether you want to add the plugins to ${pkg.name}`,
        choices,
        default: true
      }
    ]);
    if (!confirm) return;
  
    const deps = checkedList.map(it => it.value).join(" ");
    try {
      if (hasYarn) {
        await run(`yarn add ${deps}`);
        await run(`yarn install`);
      } else {
        await run(`npm install ${deps} --save`);
      }
    }catch(e) {
      error('Failed to add dependencies')
      throw e
    }
    
    console.log(chalk.blue("dependencies added successfully"));
  }

  async getList() {
    // const { res } = request.get('uri')
    return [
      {
        name: "test plugin",
        value: "url"
      },
      {
        name: "test plugin2",
        value: "url"
      }
    ];
  }
}

module.exports = function(options) {
  return new Query(options);
};
