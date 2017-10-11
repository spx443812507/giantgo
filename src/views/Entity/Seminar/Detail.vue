<template>
  <div><!--编辑界面-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性" name="attributes">
        <attribute-editor :entity-type-id="entityTypeId"></attribute-editor>
      </el-tab-pane>
      <el-tab-pane label="会议" name="seminars">
        <el-table :data="seminars.items" :key="Math.random()" stripe border style="width: 100%">
          <el-table-column prop="title" label="会议名称"></el-table-column>
          <el-table-column label="开始时间" width="180">
            <template scope="scope">
              {{scope.row.start_at | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="结束时间" width="180">
            <template scope="scope">
              {{scope.row.end_at | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column prop="contacts_count" label="报名人数" width="100" align="center"></el-table-column>
        </el-table>
        <div class="pager">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="seminars.pager.currentPage"
            :page-size="seminars.pager.pageSize"
            layout="total, prev, pager, next"
            :total="seminars.pager.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .attribute_options {
    .el-input {
      width: 200px;
      margin: 0 10px 10px 0;
    }
  }

  .pager {
    float: right;
    margin-top: 10px;
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */
  import attributeEditor from '../../../components/AttributeEditor.vue'

  export default{
    data () {
      return {
        entityTypeId: this.$route.params.entityTypeId,
        activeName: 'attributes',
        seminars: {
          items: [],
          pager: {
            currentPage: 1,
            pageSize: 15,
            total: 0
          }
        }
      }
    },
    components: {attributeEditor},
    methods: {
      handleCurrentChange (val) {
        this.loadSeminars()
      },
      loadSeminars () {
        this.axios.get('/api/seminars', {
          params: {
            entity_type_id: this.entityTypeId,
            page: this.seminars.pager.currentPage,
            per_page: this.seminars.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.seminars.items = data['data']
          this.seminars.pager.currentPage = data['current_page']
          this.seminars.pager.total = data['total']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      if (this.entityTypeId) {
        this.loadSeminars()
      } else {
        this.$message.warning('无效的模型')
      }
    }
  }
</script>
