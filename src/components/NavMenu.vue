<template>
  <el-row class="header">
    <el-col :span="6">
      <img src="../assets/images/logo.png" class="logo">
    </el-col>
    <el-col :span="14">
      <el-menu mode="horizontal" :default-active="currentIndex" @select="handleSelect">
        <el-menu-item index="0">
          <router-link :to="'/home'">首页</router-link>
        </el-menu-item>
        <el-menu-item index="1">
          <router-link :to="'/entities/user'">模型管理</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link :to="'/seminars'">会议管理</router-link>
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
<style lang="scss" rel="stylesheet/scss">
  .header {
    .el-menu {
      background-color: rgb(32, 160, 255);
      li a {
        color: #fff
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
    padding-right: 35px;
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
        currentIndex: '1'
      }
    },
    props: {},
    components: {},
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    mounted () {
    }
  }
</script>
