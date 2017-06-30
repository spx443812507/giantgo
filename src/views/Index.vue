<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <el-col class="content" :span="20">

      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script type="text/ecmascript-6">
  import navMenu from '../components/NavMenu.vue'
  import entityMenu from '../components/EntityMenu.vue'

  export default{
    data () {
      return {
        messages: []
      }
    },
    components: {navMenu, entityMenu},
    mounted () {
    }
  }
</script>
