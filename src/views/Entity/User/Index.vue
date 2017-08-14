<template>
  <div>
    <el-card class="entity-card" v-for="entityType in userEntityTypes" :key="entityType.id">
      <div>
        <div>模型名称：{{entityType.entity_type_name}}</div>
        <div>用户数量：{{entityType.entity_instance_count}}</div>
      </div>
      <router-link :to="{name: 'entityUserDetail', params: {entityTypeId: entityType.id}}">
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
  import axios from 'axios'

  export default{
    data () {
      return {
        userEntityTypes: []
      }
    },
    components: {},
    mounted () {
      axios.get('/api/entities/contact').then(response => {
        this.userEntityTypes = response['data']['data']
      }, response => {
      })
    }
  }
</script>
