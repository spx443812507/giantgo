<template>
  <div>
    <el-row>
      <nav-menu></nav-menu>
    </el-row>
    <el-row>

    </el-row>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script type="text/ecmascript-6">
  import navMenu from '../../components/NavMenu.vue'
  import entityMenu from '../../components/EntityMenu.vue'

  export default{
    data () {
      return {
        imagePrefix: 'http://sino2016.top/images/',
        messages: []
      }
    },
    components: {navMenu, entityMenu},
    mounted () {
    }
  }
</script>
