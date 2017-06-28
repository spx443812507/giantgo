<template>
  <home-layout>
  </home-layout>
</template>
<style lang="scss" rel="stylesheet/scss">
</style>
<script type="text/ecmascript-6">
  import homeLayout from '../../layouts/Home.vue'

  export default{
    data () {
      return {
        imagePrefix: 'http://sino2016.top/images/',
        messages: []
      }
    },
    components: {homeLayout},
    mounted () {
    }
  }
</script>
