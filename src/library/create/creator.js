const EventEmitter = require("events");
const { hasProjectGit } = require("../../util/env");
const { hasGit, hasYarn } = require("../../util/env");
const { run } = require("../../util")
class Creator extends EventEmitter {
  constructor(name, context, options) {
    super();

    this.name = name;
    this.context = context;
    this.options = options;
  }

  async shouldInitGit(cliOptions) {
    if (!hasGit()) {
      return false;
    }
    // --git
    if (cliOptions.forceGit) {
      return true;
    }
    // --no-git
    if (cliOptions.git === false || cliOptions.git === "false") {
      return false;
    }
    // default: true unless already in a git repo
    return !hasProjectGit(this.context);
  }

  async initProject() {
    // init git
    const shouldInitGit = this.shouldInitGit(this.options);
    if (shouldInitGit) {
      await run("git init");
      await run("git add -A");
      const msg =
        typeof this.options.git === "string" ? this.options.git : "init";
      try {
        await run("git", ["commit", "-m", msg]);
      } catch (e) {
        warn(
          `Skipped git commit due to missing username and email in git config.\n` +
            `You will need to perform the initial commit yourself.\n`
        );
      }
    }

    // install dep
    if (hasYarn()) {
      await run("yarn install");
    } else {
      await run("npm install");
    }
  }
}

module.exports = function() {
  require("./template")(Creator, [...arguments]);
};
