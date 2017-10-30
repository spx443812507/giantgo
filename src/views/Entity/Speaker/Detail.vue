<template>
  <div><!--编辑界面-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性" name="attributes">
        <attribute-editor :entity-type-id="entityTypeId"></attribute-editor>
      </el-tab-pane>
      <el-tab-pane label="演讲嘉宾" name="speakers">
        <el-table :data="speakers.items" stripe border style="width: 100%">
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column prop="company" label="公司" width="240"></el-table-column>
          <el-table-column prop="position" label="职位" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="speakers.pager.currentPage"
            :page-size="speakers.pager.pageSize"
            layout="total, prev, pager, next"
            :total="speakers.pager.total">
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
        speakers: {
          items: [],
          pager: {
            currentPage: 1,
            pageSize: 15,
            total: 0
          }
        }
      }
    },
    mixins: [],
    components: {attributeEditor},
    methods: {
      handleCurrentChange (val) {
        this.loadSpeakers()
      },
      loadSpeakers () {
        this.axios.get('/api/search/speakers', {
          params: {
            entity_type_id: this.entityTypeId,
            page: this.speakers.pager.currentPage,
            per_page: this.speakers.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.speakers.items = data['data']
          this.speakers.pager.currentPage = data['current_page']
          this.speakers.pager.total = data['total']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      if (this.entityTypeId) {
        this.loadSpeakers()
      } else {
        this.$message.warning('无效的模型')
      }
    }
  }
</script>
