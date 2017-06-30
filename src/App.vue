<template>
  <router-view></router-view>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'app',
    components: {}
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
    height: 100%;
    width: 100%;
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
</style>
