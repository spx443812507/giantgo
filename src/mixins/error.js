/* eslint-disable one-var */
export default {
  methods: {
    showErrorMessage (response) {
      if (response['response']['status'] === 422) {
        let message = []
        this._.forIn(response['response']['data']['error'], (value, key) => {
          this._.forEach(value, item => {
            message.push(item['message'])
          })
        })
        this.$message({
          message: message.join('<br/>'),
          type: 'warning'
        })
      } else {
        this.$message(response['response']['data']['message'])
      }
    }
  }
}
