/* eslint-disable */
import Vue from 'vue';
import ImageView from './main.vue';

const ImageViewDirective = {};

ImageViewDirective.install = Vue => {
  if (Vue.prototype.$isServer) return;
  Vue.directive('imageview', {
    bind: function (el, binding, vnode) {
      el.onclick = function (e) {
        var index = (this.attributes[ 'imageview-index' ] || {}).value
        var images = binding.value
        // 没传参数&&点击图片
        if (!images && this.tagName.toLowerCase() == 'img') {
          images = this.src
        }
        vnode.context.$imageview.show(images, index)
      }
    },
  })
}

export default ImageViewDirective;
