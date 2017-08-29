<template>
  <el-menu default-active="1" @open="handleOpen" @close="handleClose">
    <el-menu-item index="1">
      <router-link :to="'/entities/contact'"><i class="el-icon-message"></i>联系人模型</router-link>
    </el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-message"></i>会议模型</template>
      <el-menu-item index="2-1">简介模型</el-menu-item>
      <el-menu-item index="2-2">嘉宾模型</el-menu-item>
      <el-menu-item index="3-1">日程模型</el-menu-item>
    </el-submenu>
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
    name: 'entity-menu',
    data () {
      return {}
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
