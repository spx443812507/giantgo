<template>
  <div>
    <el-card class="entity-card" v-for="entityType in userEntityTypes">
      <div>
        <div>模型名称：{{entityType.entity_type_name}}</div>
        <div>用户数量：{{entityType.entity_instance_count}}</div>
      </div>
      <router-link :to="{path: '/entity/user/detail', query: {entity_type_id: entityType.id}}">
        查看
      </router-link>
    </el-card>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .entity-card {
    width: 480px;
    display: inline-block;
    margin: 0 15px 15px 0;
    a {
      color: #20a0ff;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        userEntityTypes: []
      }
    },
    components: {},
    mounted () {
      this.$http.get('/api/entities/user').then(response => {
        this.userEntityTypes = response['body']
      }, response => {
        // error callback
      })
    }
  }
</script>
