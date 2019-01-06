const fs = require("fs");
const path = require("path");
const chalk = require("chalk")
const execa = require('execa')
const _ = require("lodash");

exports.loadCommands = (dir, exclude) => {
  if (!dir) {
    throw new Error("invalid dir");
  }

  exclude = Array.isArray((exclude = exclude || "index.js"))
    ? exclude
    : [exclude];

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }

      files.forEach(file => {
        try {
          if (~exclude.indexOf(file)) return;
          require(path.resolve(dir, file));
        } catch (e) {
          console.error(chalk.red(err));
        }
      });

      resolve(files);
    });
  });
};

exports.cleanArgs = (cmd) => {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '')
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

exports.getFilesByExt = (dir, ext) => {
  ext = /\./.test(ext) ? ext : "." + ext;

  let rst;
  let files = fs.readdirSync(dir);
  rst = files.filter(file => {
    if (!fs.statSync(file).isFile()) {
      return false;
    }

    return path.extname(file) === ext;
  });

  return rst;
};

exports.run = (command, args) => {
  if (!args) {
    [command, ...args] = command.split(/\s+/);
  }

  return execa(command, args, { cwd: this.context });
}

exports.getPkgPath = (dir = process.cwd()) => {
  const files = fs.readdirSync(dir);
  const pkgPath = files.find(file => file === "package.json");

  if (pkgPath) return path.resolve(pkgPath);
  
  const parentDir = path.relative(dir, "..");
  if (fs.ensureDirSync(parentDir) && times < 3) {
    return this.getPkgPath(parentDir, ++times);
  }
  return null;
}