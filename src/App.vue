<template>
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'app',
    components: {},
    mounted () {
      this.$store.dispatch('getMyInfo', {}).then((data) => {
      }, (response) => {
      })
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  html {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    line-height: 1.2;
  }

  body {
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
  }

  article, aside, details, figcaption, figure, footer, header, main, menu, nav, section, summary {
    display: block;
  }

  button, input, select, textarea {
    margin: 0;
    background-color: transparent;
    border-style: none;
    color: inherit;
    font-size: 14px;
  }

  label {
    font-size: 16px;
  }

  section {
    padding: .6rem 10%;
    background: hsl(0, 0%, 98%);
  }

  section:nth-child(even) {
    background: hsl(0, 0%, 94%);
  }

  h1, h2 {
    line-height: 1.3;
  }

  h1 {
    font-size: 16px;
    margin: 0 0 12px;
  }

  h2 {
    font-size: 15px;
    margin: 7.5px 15px;
  }

  p {
    font-size: 16px;
    margin: 2px 0;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .container, .wrapper {
    height: 100%;
  }

  .container {
    padding-top: 60px;
  }

  .wrapper {
    position: relative;
  }

  header {
    position: absolute;
    width: 100%;
    height: 60px;
    line-height: 60px;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 1;
    box-sizing: border-box;
    background-color: rgb(32, 160, 255);
  }

  .menu {
    height: 100%;
  }

  .content {
    padding: 25px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
</style>
