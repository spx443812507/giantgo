<template>
  <div>
    <el-form-item v-for="attribute in attributes" :label="attribute.front_label" prop="attribute.attribute_code"
                  :key="attribute.id">
    </el-form-item>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
  export default{
    name: 'entity_attribute_value',
    props: ['attributes'],
    data () {
      return {}
    },
    components: {},
    methods: {},
    mounted () {
    }
  }
</script>
