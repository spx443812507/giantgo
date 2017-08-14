<template>
  <div class="wrapper">

  </div>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
  import axios from 'axios'

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        seminar: {
          title: ''
        }
      }
    },
    components: {},
    methods: {
      loadSeminar () {
        axios.get('/api/seminars/' + this.seminarId).then(response => {
          let data = response['data']

          this.seminar.title = data['title']
        }, response => {
          this.$message(response['data']['message'])
        })
      }
    },
    mounted () {
      this.loadSeminar()
    }
  }
</script>
