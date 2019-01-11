const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const loadRemote = require("../../util/loadRemote");
const { union } = require('lodash')
const {
  logWithSpinner,
  stopSpinner
} = require("../../util/spinner");
const {
  warn,
  error
} = require("../../util/logger");

module.exports = function (Creator, argus) {
  class Template extends Creator {
    constructor() {
      super(...argus);

      this.download();
    }

    async download() {
      const list = await this.getList();
      const choices = list.map(it => ({
        name: it.url,
        value: it.url
      }));

      const {
        url
      } = await inquirer.prompt([{
        name: "url",
        type: "list",
        message: `Please select a template:`,
        choices
      }]);

      try {
        logWithSpinner("📑", "Download git repository");
        const preset = await loadRemote(url, true);
        stopSpinner();

        return this.generate(preset);
      } catch (e) {
        stopSpinner(false);
        error(`Failed fetching remote ${chalk.cyan(url)}:`);
        throw e;
      }
    }

    async getList() {
      logWithSpinner("🔍", "Search the template list");
      stopSpinner();
      return [{
        url: "biorz/template-component",
        author: "biorz",
        description: ""
      }];
    }

    async setProject() {
      const pkgPath = path.resolve(this.context, "package.json");
      try {
        const pkg = fs.readFileSync(pkgPath, 'utf8')
      } catch (e) {
        return warn(`package.json not found in ${chalk.yellow(this.context)}`);
      }

      const match = pkg.match(/\<=(.*?)\>/g)
      if(!match) return

      let choice = match.map(it => it.replace(/\<=(.*?)\>/, ($0, $1) => {
        if($1) return $1.trim()
      }))
      choice = union(choice)

      const answers = await inquirer.prompt(
        choice.map(it => ({
          name: it,
          type: "input",
          message: `Please enter the project ${it}:`,
          default: this.name
        }))
      );

      const gen = pkg.replace(/\<=(.*?)\>/g, ($0, $1) => {
        $1 = $1 && $1.trim()
        return answers[$1]
      })

      return fs.writeFileSync(pkgPath, gen, 'utf8');
    }

    async generate(tmp) {
      fs.copySync(tmp, this.context);

      await this.setProject();
      logWithSpinner("🚐", "Initialize project");
      await this.initProject();
      stopSpinner();
      console.log("project is created at", chalk.blue(this.context));
    }
  }

  return new Template(...argus);
};