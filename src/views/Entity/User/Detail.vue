<template>
  <div><!--编辑界面-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性" name="attributes">
        <el-row>
          <el-button class="btn-add" type="primary" @click.native="showAttributeEditor">创建属性</el-button>
        </el-row>
        <el-row>
          <el-table :data="attributes" stripe border style="width: 100%">
            <el-table-column prop="attribute_code" label="属性代码" width="180"></el-table-column>
            <el-table-column prop="frontend_input" label="类型" width="180"></el-table-column>
            <el-table-column prop="frontend_label" label="名称" width="180"></el-table-column>
            <el-table-column prop="description" label="描述"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  size="small"
                  @click="showAttributeEditor(scope.$index, scope.row)">编辑
                </el-button>
                <el-button
                  size="small"
                  type="danger"
                  @click="deleteAttribute(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="用户" name="users">
        <el-table :data="users" stripe border style="width: 100%">
          <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
          <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" width="180"></el-table-column>
          <el-table-column label="注册时间" width="180">
            <template scope="scope">
              {{formatDate(scope.row.created_at)}}
            </template>
          </el-table-column>
          <el-table-column label="最后登录时间" width="180">
            <template scope="scope">
              {{formatDate(scope.row.last_login)}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="attributeForm.title" v-model="attributeEditorVisible">
      <el-form :model="attributeForm" label-width="80px">
        <el-form-item label="属性代码" prop="name">
          <el-input v-model="attributeForm.attribute_code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-input v-model="attributeForm.frontend_label" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="attributeEditorVisible = false">取消</el-button>
        <el-button type="primary" @click.native="createOrEditAttribute" :loading="attributeFormLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .btn-add {
    float: right;
    margin: 0 10px 10px;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'

  export default{
    data () {
      return {
        activeName: 'attributes',
        attributes: [],
        users: [],
        attributeForm: {
          id: '',
          title: '',
          attribute_code: '',
          frontend_label: ''
        },
        attributeFormLoading: false,
        attributeEditorVisible: false
      }
    },
    components: {},
    methods: {
      formatDate (date) {
        return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      showAttributeEditor (index, row) {
        if (row && row.id) {
          this.attributeForm.id = row.id
          this.attributeForm.title = '编辑'
          this.attributeForm.attribute_code = row.attribute_code
          this.attributeForm.frontend_label = row.frontend_label
        } else {
          this.attributeForm.id = ''
          this.attributeForm.title = '创建'
          this.attributeForm.attribute_code = ''
          this.attributeForm.frontend_label = ''
        }
        this.attributeEditorVisible = true
      },
      createOrEditAttribute () {
        if (this.attributeForm.id) {

        } else {

        }
      },
      deleteAttribute (index, row) {

      }
    },
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
