<template>
  <el-row class="header">
    <el-col :span="6">
      <img src="../assets/images/logo.png" class="logo">
    </el-col>
    <el-col :span="14">
      <el-menu mode="horizontal" :default-active="currentIndex">
        <el-menu-item v-for="(navigator, index) in navigators" :index="index + ''">
          <router-link :to="navigator.url">{{navigator.title}}</router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="user-info">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.email}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>设置</el-dropdown-item>
          <el-dropdown-item divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .header {
    .el-menu {
      background-color: rgb(32, 160, 255);
      li {
        a {
          opacity: .8;
          display: block;
          color: #fff
        }
        &:hover {
          background-color: inherit;
          a {
            opacity: .9;
          }
        }
        &.is-active {
          a {
            opacity: 1;
            font-weight: 700;
          }
        }
      }
    }
  }

  .logo {
    height: 50px;
    width: auto;
    margin-left: 10px;
    margin-top: 5px;
  }

  .user-info {
    text-align: right;
    float: right;
    span {
      cursor: pointer;
      color: #fff;
    }
  }
</style>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default{
    name: 'nav-menu',
    data () {
      return {
        currentIndex: '0',
        navigators: [
          {
            title: '首页',
            url: '/home',
            key: 'home'
          }, {
            title: '模型管理',
            url: '/entities/contact',
            key: 'entities'
          }, {
            title: '会议管理',
            url: '/seminars',
            key: 'seminars'
          }
        ]
      }
    },
    props: {},
    components: {},
    created () {
      this.routeChange()
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    watch: {
      '$route': 'routeChange'
    },
    methods: {
      routeChange () {
        this.currentIndex = this._.findIndex(this.navigators, navigator => {
          return this.$route.fullPath.indexOf(navigator.key) > -1
        }).toString()
      }
    },
    mounted () {
    }
  }
</script>
