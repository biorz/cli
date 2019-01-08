<style lang="css">
  @import 'assets/styles/common.css';

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    height: 100%;
  }
</style>

<template>
  <div id="app">
  </div>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'app',
    mounted() {
      console.log(this)
      this.$imageview({images: ['url'], index: 0})
    }
  };
</script>
