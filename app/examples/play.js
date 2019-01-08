import Vue from 'vue';
import Element from 'main/index.js';
import App from './play/index.vue';

Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
