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

  export default{
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
    methods: {},
    watch: {},
    mounted () {
    }
  }
</script>
