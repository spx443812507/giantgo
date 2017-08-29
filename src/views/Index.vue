<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <el-col class="content" :span="24">
        <a :href="oAuthUrl">登录</a>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<script type="text/ecmascript-6">
  import navMenu from '../components/NavMenu.vue'
  import entityMenu from '../components/EntityMenu.vue'

  export default{
    data () {
      return {
        oAuthUrl: 'http://test-memberb.smarket.net.cn/oauth/qq/login?XDEBUG_SESSION_START=PHPSTORM&app_id=101405226',
        messages: []
      }
    },
    components: {navMenu, entityMenu},
    mounted () {
      this.oAuthUrl = this.oAuthUrl + '&return_url=' + encodeURIComponent(window.location.href)

      if (this.$cookie.get('token')) {
        this.oAuthUrl = this.oAuthUrl + '&token=' + this.$cookie.get('token')
      }
    }
  }
</script>
