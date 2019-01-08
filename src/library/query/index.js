const request = require("../../util/request");
const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const {
  run,
  getPkgPath
} = require("../../util");
const {
  warn,
  error
} = require("../../util/logger");
const {
  hasYarn
} = require("../../util/env");

class Query {
  constructor(options) {
    this.context = process.cwd();
    this.options = options;

    this.toInstall();
  }

  async toInstall() {
    const list = await this.getList();
    if (!list.length) {
      return warn('No available plugins were found')
    }
    const choices = list.map(it => {
      const get = (key) => {
        if(!it[key]) return ''
        return '  ' + it[key]
      }
      return {
        name: `${it.name}${get('biorz')}${get('description')}`,
        value: it.name
      }
    });
    const {
      checkedList
    } = await inquirer.prompt([{
      name: "checkedList",
      type: "checkbox",
      message: "Please select the plugin you want to install",
      choices,
      pageSize: 10
    }]);

    const pkgPath = getPkgPath(this.context);
    if (!pkgPath) {
      return warn("Could not find package.json");
    }

    const pkg = fs.readJsonSync(pkgPath);
    const {
      confirm
    } = await inquirer.prompt([{
      name: "confirm",
      message: `Confirm whether you want to add the plugins to ${pkg.name}`,
      choices,
      default: true
    }]);
    if (!confirm) return;

    const deps = checkedList.map(it => it.value).join(" ");
    try {
      if (hasYarn) {
        await run(`yarn add ${deps}`);
        await run(`yarn install`);
      } else {
        await run(`npm install ${deps} --save`);
      }
    } catch (e) {
      error('Failed to add dependencies')
      throw e
    }

    console.log(chalk.blue("dependencies added successfully"));
  }

  async getList() {
    const {
      body
    } = await request.get('http://192.168.199.131:4873/-/search/@ymm-ui')
    const list = body.filter(it => {
      return it.name.indexOf('@ymm-ui/') === 0
    })
    return body
  }
}

module.exports = function (options) {
  return new Query(options);
};