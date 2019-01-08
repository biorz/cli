import { createTest, createVue, destroyVM } from '../util';
import Demo from 'packages/Demo';

describe('Demo', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(Demo, {
    }, true);
    expect(vm.$el.querySelector('.el-alert__title').textContent).to.equal('test');
    expect(vm.$el.classList.contains('el-alert--info')).to.true;
  });

  it('close', () => {
    vm = createVue({
      template: `
        <div>
          <demo></el-alert>
        </div>
      `
    }, true);
    expect(vm).to.true;
  });
});
