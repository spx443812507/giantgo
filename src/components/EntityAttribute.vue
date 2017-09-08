<template>
  <div>
    <el-input v-model="currentValue" v-if="frontendInput === 'text'"></el-input>
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4}"
      v-model="currentValue"
      v-if="frontendInput === 'textarea'">
    </el-input>
    <el-input-number v-model="currentValue" v-if="frontendInput === 'number'" auto-complete="off">
    </el-input-number>
    <el-date-picker type="datetime" v-model="currentValue" v-if="frontendInput === 'datetime'">
    </el-date-picker>
    <el-select v-model="currentValue" placeholder="请选择" v-if="frontendInput === 'select'">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.label"
        :value="item.id">
      </el-option>
    </el-select>
    <el-checkbox-group v-model="currentValue" v-if="frontendInput === 'checkbox'">
      <el-checkbox
        v-for="item in options"
        :label="item.id"
        :key="item.id">
        {{item.label}}
      </el-checkbox>
    </el-checkbox-group>
    <el-radio-group v-model="currentValue" v-if="frontendInput === 'radio'">
      <el-radio
        v-for="item in options"
        :label="item.id"
        :key="item.id">
        {{item.label}}
      </el-radio>
    </el-radio-group>
    <el-switch
      v-model="currentValue"
      v-if="frontendInput === 'switch'"
      on-text="开"
      off-text="关">
    </el-switch>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default{
    name: 'entity-attribute',
    data () {
      return {
        currentValue: this.value
      }
    },
    props: {
      value: [String, Number, Object, Array],
      frontendInput: [String],
      options: [Array]
    },
    components: {},
    created () {
    },
    computed: {},
    methods: {},
    watch: {
      value (val, oldValue) {
        this.currentValue = val
      },
      currentValue (value) {
        this.$emit('input', value)
      }
    },
    mounted () {
    }
  }
</script>
