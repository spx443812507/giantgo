<template>
  <el-row type="flex" justify="center">
    <el-col :span="8">
      <el-input v-model="user.email" placeholder="邮箱/手机号"></el-input>
      <el-input v-model="user.password" placeholder="密码"></el-input>
      <el-button type="primary" @click.native="signIn">登录</el-button>
    </el-col>
  </el-row>
</template>
<style lang="scss" rel="stylesheet/scss">

</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        user: {
          email: 'admin@admin.com',
          password: 'admin'
        }
      }
    },
    components: {},
    methods: {
      signIn () {
        this.$store.dispatch('signIn', this.user).then(() => {
          this.redirectPage()
        }, (error) => {
          console.log(error)
        })
      },
      redirectPage () {
        let redirectUrl = this.$route.query.redirect
        if (redirectUrl) {
          this.$router.push({path: redirectUrl})
        } else {
          this.$router.push({name: 'home'})
        }
      }
    }
  }
</script>
