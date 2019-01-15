/* eslint-disable */
import Vue from 'vue'
import imageView from './main.vue'
let ImageViewConstructor = Vue.extend(imageView)
let instance;

var MImageView = function (options) {
  if (Vue.prototype.$isServer) return;
  if (!instance) {
    instance = new ImageViewConstructor({})
    instance.value = options.images
    instance.index = options.index
    instance.$mount();
    window.document.body.appendChild(instance.$el);
  } else {
    instance.value = options.images
    instance.index = options.index
    instance.initData()
  }
  instance.visible = true;
  return instance;
}

/**
 * 参数接收如下几种类型
 * 1、'url'
 * 2、['url', 'url2'], index
 * 3、[{url: 'url', thumb: 'url',title:''},{url: 'url', thumb: 'url',title:''}], index
 */
MImageView.show = function () {
  var images = arguments[ 0 ]
  var index = arguments[ 1 ] || 0
  return MImageView({ images: images, index: index });
}

MImageView.close = function () {
  // 组件内部实现了close方法
  if (typeof instance.close === 'function') {
    instance.close()
  }
}

export default MImageView;
