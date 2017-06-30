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
<style lang="scss" rel="stylesheet/scss">
  .container, .wrapper {
    height: 100%;
  }

  .container {
    padding-top: 60px;
  }

  header {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 1;
    box-sizing: border-box;
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
<script type="text/ecmascript-6">
  import navMenu from '../components/NavMenu.vue'
  import entityMenu from '../components/EntityMenu.vue'

  export default{
    data () {
      return {
        userEntityTypes: []
      }
    },
    components: {navMenu, entityMenu},
    mounted () {
      this.$http.get('/api/entities/user').then(response => {
        this.userEntityTypes = response['body']
      }, response => {
        // error callback
      })
    }
  }
</script>
