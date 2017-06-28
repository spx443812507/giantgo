<template>
  <home-layout>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-col :span="6" v-for="entityType in userEntityTypes">
          <el-card>
            <div>
              <div>模型名称：{{entityType.entity_type_name}}</div>
              <div>用户数量：{{entityType.entity_instance_count}}</div>
            </div>
            <router-link :to="{path: '/entity/user/detail', query: {entity_type_id: entityType.id}}"
                         class="description_top">
              查看
            </router-link>
          </el-card>
        </el-col>
      </el-col>
    </el-row>
  </home-layout>
</template>
<style lang="scss" rel="stylesheet/scss">
  .el-card {
    margin: 10px;
  }

  a {
    color: #20a0ff;
  }
</style>
<script type="text/ecmascript-6">
  import homeLayout from '../../layouts/Home.vue'

  export default{
    data () {
      return {
        userEntityTypes: []
      }
    },
    components: {homeLayout},
    mounted () {
      this.$http.get('/api/entities/user').then(response => {
        this.userEntityTypes = response['body']
      }, response => {
        // error callback
      })
    }
  }
</script>
