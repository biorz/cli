/* eslint-disable */

import Vue from 'vue';
import entry from './app';
import Ui from 'main/index.js';
Vue.use(Ui);

new Vue({ // eslint-disable-line
  name: 'app',
  render: h => h(entry),
}).$mount('#app');
