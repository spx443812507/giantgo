<template>
  <div class="wrapper">
    <el-row>
      <nav-menu></nav-menu>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <entity-menu></entity-menu>
      </el-col>
      <el-col :span="20">
        <el-card class="entity-card" v-for="entityType in userEntityTypes">
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
    </el-row>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .entity-card {
    width: 480px;
    display: inline-block;
    margin: 15px;
  }

  a {
    color: #20a0ff;
  }
</style>
<script type="text/ecmascript-6">
  import navMenu from '../../components/NavMenu.vue'
  import entityMenu from '../../components/EntityMenu.vue'

  export default{
    data () {
      return {
        userEntityTypes: []
      }
    },
    components: {navMenu, entityMenu},
    mounted () {
      this.$http.get('/api/entities/user').then(response => {
        this.userEntityTypes = response['body']
      }, response => {
        // error callback
      })
    }
  }
</script>
