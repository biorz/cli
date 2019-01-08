<template>
  <div
    class="im-container"
    v-show="visible"
    @mousewheel="mousewheel"
    @DOMMouseScroll="mousewheel"
    tabindex="10000"
    @keyup="keyup">

    <div class="im-center">
      <img
        class="main-img"
        :class="{'main-transiton':isTransiton}"
        @load="imgLoad" ref="showImg"
        @mousedown="dragDown"
        :style="customStyle"
        :src="images[index] && images[index][urlKey]"
        alt="暂无图片">
    </div>

    <div class="im-button" @click="close">
      <div class="im-close"></div>
      <div class="im-close1"></div>
    </div>

    <div class="footer-box">
      <div class="imgTitle">
        <span>{{images[index] && images[index][titleKey]}}</span>
      </div>
      <ul class="im-toolbar" :class="{'btm-bg':!showThumb}">
        <li class="desc"><span>{{index+1}} / {{images.length}}</span></li>
        <li class="im-zoom-in" @click="zoomIn">&nbsp;</li>
        <li class="im-zoom-out" @click="zoomOut">&nbsp;</li>
        <li @click="resetZoom"><span class="resetZoom">1:1</span></li>
        <!-- <li class="im-reset" @click="reset"></li> -->
        <li class="im-prev" @click="prevImg">&nbsp;</li>
        <li class="im-next" @click="nextImg">&nbsp;</li>
        <li class="im-rotate-left" @click='rotate(-1)'>&nbsp;</li>
        <li class="im-rotate-right" @click='rotate(1)'>&nbsp;</li>
        <li class="im-flip-horizontal" @click="horizontal">&nbsp;</li>
        <li class="im-flip-vertical" @click="vertical">&nbsp;</li>
      </ul>

      <ul
        class="thumb-box"
        v-if="showThumb"
        :class="{'btm-bg':showThumb}">
        <li
          v-for="(img,i) in images"
          @click="index=i"
          :key="img[thumbKey]"
          :class="{'select-img':index==i}">
          <img :src="img[thumbKey]" :title="img[titleKey]">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "MImageView",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 图片数据源
    value: {
      type: [String, Array, Object],
      default: ""
    },
    // 当前预览的图片索引
    index: {
      type: Number,
      default: 0
    },
    // 图片路径映射属性
    urlKey: {
      type: String,
      default: "url"
    },
    // 图片缩略图映射属性
    thumbKey: {
      type: String,
      default: "thumb"
    },
    // 图片标题映射属性
    titleKey: {
      type: String,
      default: "title"
    },
    // 是否显示缩略图
    showThumb: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      images: [],
      isTransiton: true,
      minScale: 0.01
    };
  },
  mounted: function() {
    // 数据初始化
    this.initData();
  },
  computed: {
    customStyle: function() {
      var me = this;
      var item = me.images[me.index];
      if (!item) return "";
      var transform = `rotate(${item.rotate}deg) scale(${item.scale},${
        item.scale
      }) rotateX(${item.rotateX}deg) rotateY(${item.rotateY}deg)`;
      return `visibility:${
        item.visible ? "visible" : "hidden"
      };-moz-transform:${transform};-webkit-transform:${transform};-o-transform:${transform};-ms-transform:${transform};transform:${transform};`;
    }
  },
  methods: {
    // 参数初始化
    initData: function() {
      var that = this;
      that.images = [];
      if (this.value.constructor && this.value.constructor.name == "Object") {
        // 当图片参数为对象时候
        that.images = getImages(this.value.images || []);
        this.index = this.value.index || 0;
        this.value.showThumb != undefined &&
          (this.showThumb = this.value.showThumb);
        this.value.urlKey && (this.urlKey = this.value.urlKey);
        this.value.thumbKey && (this.thumbKey = this.value.thumbKey);
        this.value.titleKey && (this.titleKey = this.value.titleKey);
      } else {
        // 当图片参数为字符串或数组的时候
        that.images = getImages(this.value);
      }
      // 判断是否为数字
      if (!/^[0-9]\d*$/.test(this.index)) {
        this.index = 0;
      } else {
        this.index = window.parseInt(this.index);
      }
      if (that.index > that.images.length - 1 || that.index < 0) {
        that.index = 0;
      }

      this.$nextTick(_ => {
        that.$el.focus();
      });

      // 处理图片数据列表
      function getImages(data) {
        var list = [];
        if (typeof data === "string") {
          list.push(imgItem(data, 0));
        }
        if (data instanceof Array) {
          (data || []).map((item, index) => {
            list.push(imgItem(item, index));
          });
        }
        return list;
      }

      // 封装图片对象
      function imgItem(img, index) {
        var item = {
          title: "",
          rotate: 0,
          rotateX: 0,
          rotateY: 0,
          visible: index == that.index,
          scale: 1,
          thumb: ""
        };
        if (typeof img === "string") {
          item[that.urlKey] = img;
          item[that.thumbKey] = img;
          return item;
        } else {
          var it = Object.assign(item, img);
          if (!it[that.thumbKey]) it[that.thumbKey] = it[that.urlKey] || it.src;
          return it;
        }
      }
    },

    prevImg: function() {
      this.index--;
      if (this.index < 0) {
        this.index = this.images.length - 1;
      }
    },

    nextImg: function() {
      var me = this;
      me.index++;
      if (me.index >= me.images.length) {
        me.index = 0;
      }
    },

    zoomIn: function() {
      this.images[this.index].scale += 0.1;
    },

    zoomOut: function() {
      this.images[this.index].scale -= 0.1;
      if (this.images[this.index].scale < 0) {
        this.images[this.index].scale = this.minScale;
      }
    },

    keyup(e) {
      switch (e.code) {
        case "ArrowUp":
          this.zoomIn();
          break;
        case "ArrowDown":
          this.zoomOut();
          break;
        case "ArrowRight":
          this.nextImg();
          break;
        case "ArrowLeft":
          this.prevImg();
          break;
        default:
          break;
      }
    },

    resetZoom: function() {
      this.images[this.index].scale = 1;
    },

    rotate: function(r) {
      this.images[this.index].rotate += r * 90;
    },

    horizontal: function() {
      this.images[this.index].rotateY += 180;
    },

    vertical: function() {
      this.images[this.index].rotateX += 180;
    },

    dragDown: function(e) {
      var me = this;
      e.preventDefault();
      me.isTransiton = false;
      var oDiv = e.target;
      var disX = e.clientX - oDiv.offsetLeft;
      var disY = e.clientY - oDiv.offsetTop;
      document.onmousemove = function(e) {
        var l = e.clientX - disX;
        var t = e.clientY - disY;
        oDiv.style.left = l + "px";
        oDiv.style.top = t + "px";
      };
      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
        me.isTransiton = true;
      };
    },

    imgLoad: function(e) {
      var img = this.$refs.showImg;
      var scale = this.getImgScale(img);
      var size = this.getVisbleSize();
      console.warn(img.width, img.height, scale, size);
      var top = size.height / 2 - img.height / 2;
      var left = size.width / 2 - img.width / 2;
      img.style.top = top + "px";
      img.style.left = left + "px";
      this.images[this.index].scale = scale;
      this.images[this.index].visible = true;
    },

    getVisbleSize: function() {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      };
    },

    getImgScale: function(img) {
      var screen = this.getVisbleSize();
      var scale = 1;
      if (img.height > img.width) {
        scale =
          (img.height > screen.height * 0.7
            ? screen.height * 0.7
            : img.height) / img.height;
      } else {
        scale =
          (img.width > screen.width * 0.7 ? screen.width * 0.7 : img.width) /
          img.width;
      }
      return parseFloat(scale.toFixed(1));
    },

    mousewheel: function(e) {
      var zf = e.wheelDelta
        ? e.wheelDelta > 0 ? 1 : -1
        : e.detail < 0 ? 1 : -1;
      var scale = this.images[this.index].scale + 0.1 * zf;
      if (scale < 0) {
        scale = this.minScale;
      }
      this.images[this.index].scale = scale;
    },

    close() {
      this.visible = false;
      this.images[this.index][this.urlKey] = "";
    }
  }
};
</script>
