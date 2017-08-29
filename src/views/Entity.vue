<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <el-col class="menu" :span="4">
        <entity-menu></entity-menu>
      </el-col>
      <el-col class="content" :span="20">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
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
      return {}
    },
    components: {navMenu, entityMenu},
    mounted () {
    }
  }
</script>
