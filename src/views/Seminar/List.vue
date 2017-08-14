<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <el-card class="seminar-card" v-for="seminar in seminars" :key="seminar.id">
        <div>
          <div>会议名称：{{seminar.title}}</div>
        </div>
        <router-link :to="{name: 'seminarDetail', params: {seminarId: seminar.id}}">
          查看
        </router-link>
      </el-card>
      <div class="pager">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pager.currentPage"
          :page-size="pager.pageSize"
          layout="total, prev, pager, next"
          :total="pager.total">
        </el-pagination>
      </div>
    </el-row>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .seminar-card {
    width: 480px;
    display: inline-block;
    margin: 0 15px 15px 0;
    a {
      color: #20a0ff;
    }
  }

  .pager {
    float: right;
  }
</style>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import navMenu from '../../components/NavMenu.vue'

  export default{
    data () {
      return {
        seminars: [],
        pager: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    components: {navMenu},
    methods: {
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.loadSeminars()
      },
      loadSeminars () {
        axios.get('/api/seminars', {
          params: {
            page: this.pager.currentPage,
            per_page: this.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.seminars = data['data']
          this.pager.currentPage = data['current_page']
          this.pager.total = data['total']
        }, response => {
          this.$message(response['data']['message'])
        })
      }
    },
    mounted () {
      this.loadSeminars()
    }
  }
</script>
