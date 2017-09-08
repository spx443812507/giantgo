<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <el-col class="menu" :span="4">
        <seminar-menu></seminar-menu>
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
  .el-dialog {
    .el-form {
      width: 85%;
      .line {
        text-align: center;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import navMenu from '../components/NavMenu.vue'
  import seminarMenu from '../components/SeminarMenu.vue'

  export default{
    data () {
      return {
        seminar: {
          id: this.$route.params.seminarId
        }
      }
    },
    components: {navMenu, seminarMenu},
    methods: {
      loadSeminar () {
        this.$store.dispatch('getSeminar', this.seminar.id).then((data) => {
          this.seminar = data
        }, (response) => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      this.loadSeminar()
    }
  }
</script>
