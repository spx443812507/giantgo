<template>
  <div>
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
        <el-table-column prop="attribute_code" label="属性代码"></el-table-column>
        <el-table-column label="类型">
          <template scope="scope">
            {{attributeTypes[scope.row.frontend_input]['label']}}
          </template>
        </el-table-column>
        <el-table-column prop="frontend_label" label="显示名称"></el-table-column>
        <el-table-column prop="is_required" label="是否必填" align="center" width="100">
          <template scope="scope">
            <el-switch v-model="scope.row.is_required" on-text="" off-text=""></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
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
    <el-dialog :title="attributeEditor.title" :lock-scroll="true" size="small" v-model="attributeEditor.visible">
      <el-form :model="attributeForm" ref="attributeForm" :rules="attributeRules" label-width="80px">
        <el-form-item label="属性代码" prop="attribute_code">
          <el-input v-model="attributeForm.attribute_code"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" prop="frontend_label">
          <el-input v-model="attributeForm.frontend_label"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="attributeForm.description">
          </el-input>
        </el-form-item>
        <el-form-item label="属性类型" prop="frontend_input">
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
          <el-switch v-model="attributeForm.is_required" on-text="" off-text=""></el-switch>
        </el-form-item>
        <el-form-item label="是否唯一" v-if="attributeForm.can_unique">
          <el-switch v-model="attributeForm.is_unique" on-text="" off-text=""></el-switch>
        </el-form-item>
        <div v-if="attributeForm.has_options">
          <el-form-item label="选项">
            <el-button type="primary" icon="plus" @click.native="addOption(attributeForm.options.length - 1)">
            </el-button>
          </el-form-item>
          <el-form-item
            class="attribute_options"
            v-for="(option, index) in attributeForm.options"
            :key="index"
            :prop="'options.' + index + '.label'"
            :rules="{required: true, message: '选项不能为空'}">
            <el-input v-model="option.label"></el-input>
            <el-button type="primary" icon="plus" @click.native="addOption(index)"></el-button>
            <el-button type="danger" icon="delete" @click.native="deleteOption(index)"></el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideAttributeEditor">取消</el-button>
        <el-button type="primary" @click.native="saveAttribute" :loading="attributeEditor.isSubmitting">
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
    &.el-form-item {
      margin-bottom: 0px;
    }
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default{
    name: 'attribute-editor',
    data () {
      return {
        attributeTypes: {
          'text': {label: '单行文本', hasOptions: false, canUnique: true},
          'textarea': {label: '多行文本', hasOptions: false, canUnique: false},
          'switch': {label: '开关', hasOptions: false, canUnique: false},
          'radio': {label: '单选', hasOptions: true, canUnique: false},
          'checkbox': {label: '多选', hasOptions: true, canUnique: false},
          'select': {label: '下拉', hasOptions: true, canUnique: false},
          'number': {label: '数字', hasOptions: false, canUnique: false},
          'datetime': {label: '时间', hasOptions: false, canUnique: false}
        },
        attributes: [],
        attributeForm: {
          id: '',
          attribute_code: '',
          frontend_label: '',
          frontend_input: '',
          description: '',
          is_required: false,
          is_unique: false,
          can_unique: false,
          has_options: false,
          options: []
        },
        attributeRules: {
          attribute_code: [
            {required: true, message: '请输入属性代码'},
            {max: 255, message: '长度不超过255个字符'},
            {
              validator: (rule, value, callback) => {
                if (!/^[a-zA-Z_]{1,}$/.test(value)) {
                  callback(new Error('属性代码由字母或下划线组成'))
                } else {
                  this.checkAttributeCode(value, callback)
                }
              }
            }
          ],
          frontend_label: [
            {required: true, message: '请输入显示名称'},
            {max: 255, message: '长度不超过255个字符'}
          ]
        },
        attributeEditor: {
          title: '',
          visible: false,
          isSubmitting: false
        },
        checkAttributeCode: this._.debounce((value, callback) => {
          this.axios.get('/api/entities/' + this.entityTypeId + '/attribute_codes/' + value, {
            params: {
              attribute_id: this.attributeForm.id
            }
          }).then(response => {
            if (response['data']) {
              callback()
            } else {
              callback(new Error('属性代码已存在'))
            }
          }, response => {
            this.$message.warning(response['response']['data']['message'])
          })
        }, 500)
      }
    },
    props: {
      entityTypeId: {
        type: [Number, String],
        required: true
      }
    },
    components: {},
    created () {
    },
    computed: {},
    methods: {
      createAttribute (command) {
        this.showAttributeEditor(null, {frontend_input: command})
      },
      showAttributeEditor (index, row) {
        this.attributeEditor.visible = true
        this.$nextTick(() => {
          this.$refs['attributeForm'].resetFields()
          if (row && row.id) {
            this.attributeForm.id = row.id
            this.attributeForm.title = '编辑'
            this.attributeForm.attribute_code = row.attribute_code
            this.attributeForm.frontend_label = row.frontend_label
            this.attributeForm.frontend_input = row.frontend_input
            this.attributeForm.description = row.description
            this.attributeForm.is_required = row.is_required
            this.attributeForm.is_unique = this.attributeTypes[row.frontend_input]['canUnique'] ? row.is_unique : false
            this.attributeForm.options = this.attributeTypes[row.frontend_input]['hasOptions'] ? row.options : []
          } else {
            this.attributeForm.id = ''
            this.attributeForm.title = '创建'
            this.attributeForm.attribute_code = ''
            this.attributeForm.frontend_label = ''
            this.attributeForm.frontend_input = row.frontend_input
            this.attributeForm.description = ''
            this.attributeForm.is_required = false
            this.attributeForm.is_unique = false
            this.attributeForm.options = []
          }
          this.attributeForm.has_options = this.attributeTypes[row.frontend_input]['hasOptions']
          this.attributeForm.can_unique = this.attributeTypes[row.frontend_input]['canUnique']
        })
      },
      hideAttributeEditor () {
        this.attributeEditor.visible = false
      },
      addOption (index) {
        this.attributeForm.options.splice(index + 1, 0, {attribute_id: this.attributeForm.id, value: ''})
      },
      deleteOption (index) {
        this.attributeForm.options.splice(index, 1)
      },
      saveAttribute () {
        this.$refs['attributeForm'].validate((valid) => {
          if (valid) {
            let url = '/api/entities/' + this.entityTypeId + '/attributes',
              method = 'post',
              data = {
                attribute_code: this.attributeForm.attribute_code,
                frontend_input: this.attributeForm.frontend_input,
                frontend_label: this.attributeForm.frontend_label,
                description: this.attributeForm.description,
                is_required: this.attributeForm.is_required,
                is_unique: this.attributeForm.is_unique,
                options: this.attributeForm.options
              }

            if (this.attributeForm.id) {
              method = 'put'
              url += '/' + this.attributeForm.id
            }

            if (this.attributeForm.has_options && this.attributeForm.options.length <= 0) {
              this.$message.warning('至少要有一个选项')
              return
            }
            this.axios[method](url, data).then(response => {
              this.hideAttributeEditor()
              this.loadAttributes()
              this.$message.success('保存成功')
            }, response => {
              this.$message.warning(response['response']['data']['message'])
            })
          }
        })
      },
      deleteAttribute (index, row) {
        this.$confirm('此操作将永久删除属性：' + row.frontend_label + '，同时清除该属性对应的用户信息，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/entities/' + this.entityTypeId + '/attributes/' + row.id).then(response => {
            this.loadAttributes()
            this.$message.success('删除成功!')
          }, response => {
            this.$message.warning(response['response']['data']['message'])
          })
        }).catch(() => {
          this.$message('已取消删除')
        })
      },
      loadAttributes () {
        this.axios.get('/api/entities/' + this.entityTypeId + '/attributes').then(response => {
          this.attributes = response['data']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    watch: {},
    mounted () {
      if (this.entityTypeId) {
        this.loadAttributes()
      }
    }
  }
</script>
