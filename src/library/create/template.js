const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const loadRemote = require("../../util/loadRemote");
const { logWithSpinner, stopSpinner } = require("../../util/spinner");
const { warn, error } = require("../../util/logger");

module.exports = function(Creator, argus) {
  class Template extends Creator {
    constructor() {
      super(...argus);

      this.init();
    }

    async init() {
      const list = await this.getList();
      const choices = list.map(it => ({
        name: it.url,
        value: it.url
      }));

      const { url } = await inquirer.prompt([
        {
          name: "url",
          type: "list",
          message: `Please select a template:`,
          choices
        }
      ]);
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
      return [
        {
          url: "biorz/library",
          author: "biorz",
          description: "这是一个demo"
        }
      ];
    }

    async setProject() {
      const prompts = [];
      prompts.push({
        name: "description",
        type: "input",
        message: "Please enter the project description:",
        default: this.name
      });
      const answers = await inquirer.prompt(prompts);

      const pkgPath = path.resolve(this.context, "package");
      if (fs.ensureFileSync(pkgPath)) {
        const pkg = fs.readJsonSync(pkgPath);
        Object.keys(answers).forEach(it => {
          pkg[it] = answers[it];
        });

        return fs.writeJsonSync(path.resolve(this.context, "package"), pkg);
      }
      warn(`package.json not found in ${chalk.yellow(this.context)}`);
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
