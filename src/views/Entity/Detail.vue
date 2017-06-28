<template>
  <home-layout>
    <h2>属性列表：</h2>
    <el-table :data="attributes" stripe border style="width: 100%">
      <el-table-column prop="attribute_code" label="属性代码" width="180"></el-table-column>
      <el-table-column prop="frontend_input" label="类型" width="180"></el-table-column>
      <el-table-column prop="frontend_label" label="名称" width="180"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
    </el-table>
    <h2>人员列表：</h2>
    <el-table :data="users" stripe border style="width: 100%">
      <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
      <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
      <el-table-column prop="frontend_label" label="名称" width="180"></el-table-column>
      <el-table-column prop="verified_email" label="是否验证邮箱"></el-table-column>
      <el-table-column prop="verified_mobile" label="是否验证手机"></el-table-column>
      <el-table-column prop="created_at" label="注册时间"></el-table-column>
      <el-table-column prop="last_login" label="最后登录时间"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </home-layout>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
  import homeLayout from '../../layouts/Home.vue'

  export default{
    data () {
      return {
        attributes: [],
        users: []
      }
    },
    components: {homeLayout},
    mounted () {
      this.$http.get('/api/attributes?entity_type_id=' + this.$route.query.entity_type_id).then(response => {
        this.attributes = response['body']
      }, response => {
        // error callback
      })
      this.$http.get('/api/users?entity_type_id=' + this.$route.query.entity_type_id).then(response => {
        this.users = response['body']
      }, response => {
        // error callback
      })
    }
  }
</script>
