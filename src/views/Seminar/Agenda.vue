<template>
  <el-col :span="12">
    <el-tabs type="border-card">
      <el-tab-pane label="用户管理">{{seminar.title}}</el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId
      }
    },
    computed: {
      ...mapGetters([
        'seminar'
      ])
    },
    components: {},
    methods: {},
    mounted () {
    }
  }
</script>
