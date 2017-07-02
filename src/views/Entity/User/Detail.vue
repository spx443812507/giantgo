<template>
  <div><!--编辑界面-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="属性" name="attributes">
        <el-row>
          <el-dropdown class="btn-add" trigger="click" @command="createAttribute">
            <el-button type="primary">
              创建属性<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(value, key) in attributeTypes" v-bind:command="key">{{value.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
    <el-dialog :title="attributeForm.title" size="small" v-model="attributeEditorVisible">
      <el-form :model="attributeForm" label-width="80px">
        <el-form-item label="属性代码">
          <el-input v-model="attributeForm.attribute_code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-input v-model="attributeForm.frontend_label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="attributeForm.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-select v-model="attributeForm.frontend_input" disabled placeholder="请选择属性类型">
            <el-option label="单行文本" value="text"></el-option>
            <el-option label="多行文本" value="textarea"></el-option>
            <el-option label="数字" value="number"></el-option>
            <el-option label="单选" value="radio"></el-option>
            <el-option label="多选" value="checkbox"></el-option>
            <el-option label="下拉" value="select"></el-option>
            <el-option label="开关" value="switch"></el-option>
            <el-option label="时间" value="datetime"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否必填">
          <el-switch v-model="attributeForm.is_required" on-text="开" off-text="关"></el-switch>
        </el-form-item>
        <el-form-item label="是否唯一" v-if="attributeForm.has_unique">
          <el-switch v-model="attributeForm.is_unique" on-text="开" off-text="关"></el-switch>
        </el-form-item>
        <el-form-item class="attribute_options" label="选项" v-if="attributeForm.has_options">
          <div v-for="(option, index) in attributeForm.options">
            <el-input v-model="option.value"></el-input>
            <el-button type="primary" icon="plus" @click.native="addOption(index)"></el-button>
            <el-button type="danger" icon="delete" @click.native="deleteOption(index)"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideAttributeEditor">取消</el-button>
        <el-button type="primary" @click.native="createOrEditAttribute" :loading="attributeFormLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .btn-add {
    float: right;
    margin: 0 10px 10px;
  }

  .attribute_options {
    .el-input {
      width: 200px;
      margin: 0 10px 10px 0;
    }
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'

  export default{
    data () {
      return {
        attributeTypes: {
          'text': {label: '单行文本', hasOptions: false, hasUnique: true},
          'textarea': {label: '多行文本', hasOptions: false, hasUnique: true},
          'switch': {label: '开关', hasOptions: false, hasUnique: false},
          'radio': {label: '单选', hasOptions: true, hasUnique: false},
          'checkbox': {label: '多选', hasOptions: true, hasUnique: false},
          'select': {label: '下拉', hasOptions: true, hasUnique: false},
          'number': {label: '数字', hasOptions: false, hasUnique: false},
          'datetime': {label: '时间', hasOptions: false, hasUnique: false}
        },
        activeName: 'attributes',
        attributes: [],
        entityTypeId: this.$route.query.entity_type_id,
        users: [],
        attributeForm: {
          id: '',
          title: '',
          attribute_code: '',
          frontend_label: '',
          frontend_input: '',
          description: '',
          is_required: false,
          is_unique: false,
          has_unique: false,
          has_options: false,
          options: []
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
      createAttribute (command) {
        this.showAttributeEditor(null, {frontend_input: command})
      },
      showAttributeEditor (index, row) {
        if (row && row.id) {
          this.attributeForm.id = row.id
          this.attributeForm.title = '编辑'
          this.attributeForm.attribute_code = row.attribute_code
          this.attributeForm.frontend_label = row.frontend_label
          this.attributeForm.frontend_input = row.frontend_input
          this.attributeForm.description = row.description
          this.attributeForm.is_required = row.is_required
          this.attributeForm.has_unique = this.attributeTypes[row.frontend_input]['hasUnique']
          this.attributeForm.is_unique = this.attributeForm.has_unique ? row.is_unique : false
          this.attributeForm.has_options = this.attributeTypes[row.frontend_input]['hasOptions']
          this.attributeForm.options = this.attributeForm.has_options ? row.options : []
        } else {
          this.attributeForm.id = ''
          this.attributeForm.title = '创建'
          this.attributeForm.attribute_code = ''
          this.attributeForm.frontend_label = ''
          this.attributeForm.frontend_input = row.frontend_input
          this.attributeForm.description = ''
          this.attributeForm.is_required = false
          this.attributeForm.is_unique = false
          this.attributeForm.has_options = this.attributeTypes[row.frontend_input]['hasOptions']
          this.attributeForm.has_unique = this.attributeTypes[row.frontend_input]['hasUnique']
          this.attributeForm.options = []
        }
        this.attributeEditorVisible = true
      },
      hideAttributeEditor () {
        this.attributeEditorVisible = false
      },
      addOption (index) {
        this.attributeForm.options.splice(index + 1, 0, {attribute_id: this.attributeForm.id, value: ''})
      },
      deleteOption (index) {
        this.attributeForm.options.splice(index, 1)
      },
      createOrEditAttribute () {
        if (this.attributeForm.id) {
          this.$http.put('/api/attributes', {
            ...this.attributeForm,
            entity_type_id: this.entityTypeId
          }).then(response => {
            this.hideAttributeEditor()
            this.loadAttributes()
          }, response => {
            this.$message(response['body']['message'])
          })
        } else {
          this.$http.post('/api/attributes', {
            ...this.attributeForm,
            entity_type_id: this.entityTypeId
          }).then(response => {
            this.hideAttributeEditor()
            this.loadAttributes()
          }, response => {
            this.$message(response['body']['message'])
          })
        }
      },
      deleteAttribute (index, row) {
        this.$confirm('此操作将永久删除属性：' + row.frontend_label + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      loadAttributes () {
        this.$http.get('/api/attributes?entity_type_id=' + this.entityTypeId).then(response => {
          this.attributes = response['body']
        }, response => {
          this.$message(response['body']['message'])
        })
      },
      loadUsers () {
        this.$http.get('/api/users?entity_type_id=' + this.entityTypeId).then(response => {
          this.users = response['body']
        }, response => {
          this.$message(response['body']['message'])
        })
      }
    },
    mounted () {
      if (this.entityTypeId) {
        this.loadAttributes()
        this.loadUsers()
      } else {
        this.$message({
          message: '无效的模型',
          type: 'warning'
        })
      }
    }
  }
</script>
