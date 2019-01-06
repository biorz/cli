const EventEmitter = require('events')
const { hasProjectGit } = require('../../utils/env')
const execa = require('execa')
const { hasGit, hasYarn } = require("../../utils/env")

class Creator extends EventEmitter {
  constructor (name, context, options) {
    super()

    this.name = name
    this.context = context
    this.options = options
  }

  run (command, args) {
    if (!args) { [command, ...args] = command.split(/\s+/) }

    return execa(command, args, { cwd: this.context })
  }

  async shouldInitGit (cliOptions) {
    if (!hasGit()) {
      return false
    }
    // --git
    if (cliOptions.forceGit) {
      return true
    }
    // --no-git
    if (cliOptions.git === false || cliOptions.git === 'false') {
      return false
    }
    // default: true unless already in a git repo
    return !hasProjectGit(this.context)
  }

  async initProject() {
    const shouldInitGit = this.shouldInitGit(this.options)
    if(shouldInitGit) {
      await this.run('git init')
      await this.run('git add -A')
      const msg = typeof this.options.git === 'string' ? this.options.git : 'init'
      try {
        await this.run('git', ['commit', '-m', msg])
      } catch (e) {
        warn(
          `Skipped git commit due to missing username and email in git config.\n` +
          `You will need to perform the initial commit yourself.\n`
        )
      }
    }

    if(hasYarn()) {
      await this.run('yarn install')
    }else {
      await this.run('npm install')
    }
  }
}

module.exports = function (name, context, options) {
  require('./template')(Creator,[name, context, options])
}