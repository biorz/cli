const execa = require('execa')

const run = (command, args) => {
  if (!args) {
    [command, ...args] = command.split(/\s+/);
  }

  return execa(command, args, { cwd: this.context });
}

run('karma start test/unit/karma.conf.js');
