<template>
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark"></div>
    </el-col>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        imagePrefix: 'http://sino2016.top/images/',
        messages: []
      }
    },
    components: {},
    mounted () {
    }
  }
</script>
