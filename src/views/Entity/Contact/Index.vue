<template>
  <div>
    <el-card class="entity-card" v-for="entityType in contactEntityTypes" :key="entityType.id">
      <div>
        <div>模型名称：{{entityType.entity_type_name}}</div>
        <div>用户数量：{{entityType.entity_instance_count}}</div>
      </div>
      <router-link :to="{name: 'entityContactDetail', params: {entityTypeId: entityType.id}}">
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
        contactEntityTypes: []
      }
    },
    components: {},
    mounted () {
      this.axios.get('/api/entities/contact').then(response => {
        this.contactEntityTypes = response['data']
      }, response => {
      })
    }
  }
</script>
