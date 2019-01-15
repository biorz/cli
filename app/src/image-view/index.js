/* eslint-disable */
import directive from './src/directive';
import service from './src/index';
import './index.scss'

service.install = function(Vue) {
  Vue.use(directive);
  Vue.prototype.$imageview = service;
};

export default service;