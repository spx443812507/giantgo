<template>
  <div>
    <el-form :model="attributeForm" ref="attributeForm" :rules="attributeRules" label-width="80px">
      <el-form-item label="属性代码" prop="attribute_code">
        <el-input v-model="attributeForm.attribute_code" :error="attributeErrors.attribute_code"></el-input>
      </el-form-item>
      <el-form-item label="显示名称" prop="frontend_label">
        <el-input v-model="attributeForm.frontend_label" :error="attributeErrors.frontend_label"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="attributeForm.description" :error="attributeErrors.description"></el-input>
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
        <el-switch v-model="attributeForm.is_required" on-text="开" off-text="关"></el-switch>
      </el-form-item>
      <el-form-item label="是否唯一" v-if="attributeForm.can_unique">
        <el-switch v-model="attributeForm.is_unique" on-text="开" off-text="关"></el-switch>
      </el-form-item>
      <el-form-item
        class="attribute_options"
        label="选项"
        v-if="attributeForm.has_options"
        :error="attributeErrors.options">
        <el-button type="primary" icon="plus" @click.native="addOption(attributeForm.options.length - 1)"></el-button>
        <div v-for="(option, index) in attributeForm.options" :key="index">
          <el-input v-model="option.label"></el-input>
          <el-button type="primary" icon="plus" @click.native="addOption(index)"></el-button>
          <el-button type="danger" icon="delete" @click.native="deleteOption(index)"></el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default{
    name: 'attribute-editor',
    data () {
      return {
        attributeTypes: {
          'text': {label: '单行文本', hasOptions: false, canUnique: true},
          'textarea': {label: '多行文本', hasOptions: false, canUnique: true},
          'switch': {label: '开关', hasOptions: false, canUnique: false},
          'radio': {label: '单选', hasOptions: true, canUnique: false},
          'checkbox': {label: '多选', hasOptions: true, canUnique: false},
          'select': {label: '下拉', hasOptions: true, canUnique: false},
          'number': {label: '数字', hasOptions: false, canUnique: false},
          'datetime': {label: '时间', hasOptions: false, canUnique: false}
        },
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
        }
      }
    },
    props: {
      attribute: {
        type: Object,
        default () {
          return {}
        },
        required: true
      }
    },
    components: {},
    created () {
    },
    computed: {},
    methods: {},
    watch: {
      attribute () {

      }
    },
    mounted () {
    }
  }
</script>
