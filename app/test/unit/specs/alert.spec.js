import { destroyVM } from '../util';
import ImageView from 'ymm-design/src';
import Vue from 'Vue';

describe('ImageView', () => {
  let vm;
  Vue.use(ImageView);

  afterEach(() => {
    destroyVM(vm);
  });

  it('service', () => {
    vm = Vue.prototype.$imageview({images: [''], index: 0});
  });
});
