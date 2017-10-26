<template>
  <div>
    <el-form-item
      v-for="(attribute, index) in attributes"
      :label="attribute.frontend_label"
      :prop="'attributes.' + index + '.value'"
      :key="attribute.id"
      :rules="attribute.rules"
      :error="attribute.error">
      <el-input v-model="attribute.value" v-if="attribute.frontend_input === 'text'"></el-input>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        v-model="attribute.value"
        v-if="attribute.frontend_input === 'textarea'">
      </el-input>
      <el-input-number v-model="attribute.value" v-if="attribute.frontend_input === 'number'" auto-complete="off">
      </el-input-number>
      <el-date-picker type="datetime" v-model="attribute.value" v-if="attribute.frontend_input === 'datetime'">
      </el-date-picker>
      <el-select v-model="attribute.value" placeholder="请选择" v-if="attribute.frontend_input === 'select'">
        <el-option
          v-for="item in attribute.options"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
      <el-checkbox-group v-model="attribute.value" v-if="attribute.frontend_input === 'checkbox'">
        <el-checkbox
          v-for="item in attribute.options"
          :label="item.id"
          :key="item.id">
          {{item.label}}
        </el-checkbox>
      </el-checkbox-group>
      <el-radio-group v-model="attribute.value" v-if="attribute.frontend_input === 'radio'">
        <el-radio
          v-for="item in attribute.options"
          :label="item.id"
          :key="item.id">
          {{item.label}}
        </el-radio>
      </el-radio-group>
      <el-switch
        v-model="attribute.value"
        v-if="attribute.frontend_input === 'switch'"
        on-text=""
        off-text="">
      </el-switch>
    </el-form-item>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default {
    name: 'entity-attribute',
    data () {
      return {}
    },
    props: {
      attributes: [Array]
    },
    components: {},
    created () {
    },
    computed: {},
    methods: {
      // 格式化EAV属性为可用的表单字段
      format (attributes, values) {
        values = values || {}
        return this._.map(attributes, (attribute) => {
          let attributeCode = attribute['attribute_code'],
            value = values[attributeCode]
          attribute['value'] = attribute['is_collection'] ? [] : ''
          attribute['rules'] = []
          attribute['error'] = ''

          if (attribute['is_required']) {
            attribute['rules'].push({required: true, message: '请输入' + attribute['frontend_label']})
          }
          if (attribute['frontend_input'] === 'number') {
            attribute['rules'].push({type: 'number', message: '请输入数字'})
          }

          if (value) {
            attribute['value'] = value
            if (attribute['frontend_input'] === 'datetime') {
              attribute['value'] = new Date(value)
            }
          }
          return this._.clone(attribute, true)
        })
      },
      // 获取EAV属性的值
      values () {
        let result = {}

        for (let i = 0; i < this.attributes.length; i++) {
          let attribute = this.attributes[i], attributeCode = attribute['attribute_code']
          result[attributeCode] = attribute['value']
          if (attribute['frontend_input'] === 'datetime') {
            if (attribute['value']) {
              result[attributeCode] = this.$moment(attribute['value']).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ')
            } else {
              result[attributeCode] = ''
            }
          }
        }

        return result
      }
    },
    watch: {},
    mounted () {
    }
  }
</script>
