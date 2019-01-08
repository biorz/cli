var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');
var Components = require('../components.json');
var saladConfig = require('./salad.config.json');

var utilsList = fs.readdirSync(path.resolve(__dirname, '../src/utils'));
var mixinsList = fs.readdirSync(path.resolve(__dirname, '../src/mixins'));
var transitionList = fs.readdirSync(path.resolve(__dirname, '../src/transitions'));
var externals = {};

Object.keys(Components).forEach(function(key) {
  externals[`ymm-design/packages/${key}`] = `ymm-design/lib/${key}`;
});

externals['ymm-design/src/locale'] = 'ymm-design/lib/locale';
utilsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`ymm-design/src/utils/${file}`] = `ymm-design/lib/utils/${file}`;
});
mixinsList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`ymm-design/src/mixins/${file}`] = `ymm-design/lib/mixins/${file}`;
});
transitionList.forEach(function(file) {
  file = path.basename(file, '.js');
  externals[`ymm-design/src/transitions/${file}`] = `ymm-design/lib/transitions/${file}`;
});

externals = [Object.assign({
  vue: 'vue'
}, externals), nodeExternals()];

exports.externals = externals;

exports.alias = {
  main: path.resolve(__dirname, '../src'),
  packages: path.resolve(__dirname, '../packages'),
  'packages-biz': path.resolve(__dirname, '../packages-biz'),
  examples: path.resolve(__dirname, '../examples'),
  'ymm-design': path.resolve(__dirname, '../')
};

exports.vue = {
  root: 'Vue',
  commonjs: 'vue',
  commonjs2: 'vue',
  amd: 'vue'
};

exports.jsexclude = /node_modules|utils\/popper\.js|utils\/date.\js/;

exports.postcss = function(webapck) {
  saladConfig.features.partialImport = {
    addDependencyTo: webapck
  };
  return [
    require('postcss-salad')(saladConfig)
  ];
};
