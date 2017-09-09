<template>
  <div><!--编辑界面-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性" name="attributes">
        <attribute-editor :entity-type-id="entityTypeId"></attribute-editor>
      </el-tab-pane>
      <el-tab-pane label="用户" name="contacts">
        <el-table :data="contacts.items" stripe border style="width: 100%">
          <el-table-column prop="email" label="邮箱" width="230"></el-table-column>
          <el-table-column prop="mobile" label="手机" width="150"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column label="注册时间" width="180">
            <template scope="scope">
              {{scope.row.created_at | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间" width="180">
            <template scope="scope">
              {{scope.row.last_login | moment('YYYY-MM-DD HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pager">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="contacts.pager.currentPage"
            :page-size="contacts.pager.pageSize"
            layout="total, prev, pager, next"
            :total="contacts.pager.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
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
        contacts: {
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
      loadContacts () {
        this.axios.get('/api/contacts', {
          params: {
            entity_type_id: this.entityTypeId,
            page: this.contacts.pager.currentPage,
            per_page: this.contacts.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.contacts.items = data['data']
          this.contacts.pager.currentPage = data['current_page']
          this.contacts.pager.total = data['total']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      if (this.entityTypeId) {
        this.loadContacts()
      } else {
        this.$message.warning('无效的模型')
      }
    }
  }
</script>
