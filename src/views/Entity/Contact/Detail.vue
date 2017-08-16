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
              <el-dropdown-item v-for="(value, key) in attributeTypes" :key="key" v-bind:command="key">{{value.label}}
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
      <el-tab-pane label="用户" name="contacts">
        <el-table :data="contacts.items" stripe border style="width: 100%">
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
        <div class="pager">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="contacts.pager.currentPage"
            :page-size="contacts.pager.pageSize"
            layout="total, prev, pager, next"
            :total="contacts.pager.total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="attribute.title" size="small" v-model="attributeEditor.visible">
      <el-form :model="attribute" label-width="80px">
        <el-form-item label="属性代码">
          <el-input v-model="attribute.attribute_code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-input v-model="attribute.frontend_label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="attribute.description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-select v-model="attribute.frontend_input" disabled placeholder="请选择属性类型">
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
          <el-switch v-model="attribute.is_required" on-text="开" off-text="关"></el-switch>
        </el-form-item>
        <el-form-item label="是否唯一" v-if="attribute.has_unique">
          <el-switch v-model="attribute.is_unique" on-text="开" off-text="关"></el-switch>
        </el-form-item>
        <el-form-item class="attribute_options" label="选项" v-if="attribute.has_options">
          <div v-for="(option, index) in attribute.options" :key="index">
            <el-input v-model="option.value"></el-input>
            <el-button type="primary" icon="plus" @click.native="addOption(index)"></el-button>
            <el-button type="danger" icon="delete" @click.native="deleteOption(index)"></el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideAttributeEditor">取消</el-button>
        <el-button type="primary" @click.native="createOrEditAttribute" :loading="attributeEditor.isSubmitting">
          保存
        </el-button>
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

  .pager {
    float: right;
    margin-top: 10px;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import axios from 'axios'

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
        entityTypeId: this.$route.params.entityTypeId,
        contacts: {
          items: [],
          pager: {
            currentPage: 1,
            pageSize: 15,
            total: 0
          }
        },
        attribute: {
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
        attributeEditor: {
          visible: false,
          isSubmitting: false
        }
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
          this.attribute.id = row.id
          this.attribute.title = '编辑'
          this.attribute.attribute_code = row.attribute_code
          this.attribute.frontend_label = row.frontend_label
          this.attribute.frontend_input = row.frontend_input
          this.attribute.description = row.description
          this.attribute.is_required = row.is_required
          this.attribute.has_unique = this.attributeTypes[row.frontend_input]['hasUnique']
          this.attribute.is_unique = this.attribute.has_unique ? row.is_unique : false
          this.attribute.has_options = this.attributeTypes[row.frontend_input]['hasOptions']
          this.attribute.options = this.attribute.has_options ? row.options : []
        } else {
          this.attribute.id = ''
          this.attribute.title = '创建'
          this.attribute.attribute_code = ''
          this.attribute.frontend_label = ''
          this.attribute.frontend_input = row.frontend_input
          this.attribute.description = ''
          this.attribute.is_required = false
          this.attribute.is_unique = false
          this.attribute.has_options = this.attributeTypes[row.frontend_input]['hasOptions']
          this.attribute.has_unique = this.attributeTypes[row.frontend_input]['hasUnique']
          this.attribute.options = []
        }
        this.attributeEditor.visible = true
      },
      hideAttributeEditor () {
        this.attributeEditor.visible = false
      },
      addOption (index) {
        this.attribute.options.splice(index + 1, 0, {attribute_id: this.attribute.id, value: ''})
      },
      deleteOption (index) {
        this.attribute.options.splice(index, 1)
      },
      createOrEditAttribute () {
        if (this.attribute.id) {
          axios.put('/api/attributes/' + this.attribute.id, {
            attribute: this.attribute,
            entity_type_id: this.entityTypeId
          }).then(response => {
            this.hideAttributeEditor()
            this.loadAttributes()
          }, response => {
            this.$message(response['data']['message'])
          })
        } else {
          axios.post('/api/attributes', {
            attribute: this.attribute,
            entity_type_id: this.entityTypeId
          }).then(response => {
            this.hideAttributeEditor()
            this.loadAttributes()
          }, response => {
            this.$message(response['data']['message'])
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
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.loadSeminars()
      },
      loadAttributes () {
        axios.get('/api/attributes', {
          params: {
            entity_type_id: this.entityTypeId
          }
        }).then(response => {
          this.attributes = response['data']
        }, response => {
          this.$message(response['data']['message'])
        })
      },
      loadContacts () {
        axios.get('/api/contacts', {
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
          this.$message(response['data']['message'])
        })
      }
    },
    mounted () {
      if (this.entityTypeId) {
        this.loadAttributes()
        this.loadContacts()
      } else {
        this.$message({
          message: '无效的模型',
          type: 'warning'
        })
      }
    }
  }
</script>
