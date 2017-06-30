<template>
  <el-row class="header">
    <el-col :span="6">
      <img src="../assets/images/logo.png" class="logo">
    </el-col>
    <el-col :span="14">
      <el-menu mode="horizontal" :default-active="currentIndex" @select="handleSelect">
        <el-menu-item index="1">
          <router-link :to="'/home'">首页</router-link>
        </el-menu-item>
        <el-menu-item index="1">
          <router-link :to="'/entity/user'">模型管理</router-link>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4">
      <el-menu mode="horizontal" :default-active="currentIndex" @select="handleSelect">
        <el-submenu index="2">
          <template slot="title">{{userInfo.email}}</template>
          <el-menu-item index="2-1">设置</el-menu-item>
          <el-menu-item index="2-2">退出登录</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">
  .header {
    background-color: #eef1f6;
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 1;
    box-sizing: border-box;
    .el-menu-item a {
      text-decoration: none;
      display: block;
      opacity: .8;
    }
  }

  .logo {
    height: 50px;
    width: auto;
    margin-left: 10px;
    margin-top: 5px;
  }
</style>
<script>
  import moment from 'moment'

  export default{
    name: 'page-layout',
    data () {
      return {
        userInfo: {},
        currentIndex: '1'
      }
    },
    props: {},
    components: {},
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    mounted () {
      this.$store.dispatch('getMyInfo', this.user).then((data) => {
        let user = data['body']

        this.userInfo = user
        this.userInfo.lastLogin = moment(user['last_login']).format('YYYY-MM-DD HH:mm')
        this.userInfo.verifiedEmail = user['verified_email'] ? '已认证' : '未认证'
        this.userInfo.verifiedMobile = user['verified_mobile'] ? '已认证' : '未认证'
      }, (error) => {
        this.$router.push({name: 'signin'})
        console.log(error)
      })
    }
  }
</script>
