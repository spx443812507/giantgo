<template>
  <el-menu default-active="1" @open="handleOpen" @close="handleClose">
    <el-menu-item index="1">
      <router-link :to="{name: 'seminarDetail', params: {seminarId: seminarId}}">
        <i class="el-icon-message"></i>基础信息
      </router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link :to="{name: 'seminarContact', params: {seminarId: seminarId}}">
        <i class="el-icon-fa-users"></i>联系人
      </router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link :to="{name: 'seminarAgenda', params: {seminarId: seminarId}}">
        <i class="el-icon-fa-calendar"></i>会议日程
      </router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <router-link :to="{name: 'seminarSpeaker', params: {seminarId: seminarId}}">
        <i class="el-icon-fa-user-circle-o"></i>演讲嘉宾
      </router-link>
    </el-menu-item>
    <el-menu-item index="5">
      <router-link :to="{name: 'seminarCheckin', params: {seminarId: seminarId}}">
        <i class="el-icon-fa-check-square-o"></i>签到点
      </router-link>
    </el-menu-item>
  </el-menu>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .el-menu {
    height: 100%;
    .el-menu-item a {
      display: block;
      .active {
        color: #20a0ff;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    name: 'seminar-menu',
    data () {
      return {
        seminarId: this.$route.params.seminarId
      }
    },
    components: {},
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    },
    mounted () {
    }
  }
</script>
