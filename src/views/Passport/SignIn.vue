<template>
  <el-form ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="user.email" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="user.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="signIn" :loading="logining">登录
      </el-button>
    </el-form-item>
  </el-form>
</template>
<style lang="scss" rel="stylesheet/scss">
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        logining: false,
        user: {
          email: 'admin@admin.com',
          password: 'admin'
        }
      }
    },
    components: {},
    methods: {
      signIn () {
        this.logining = true
        this.$store.dispatch('signIn', this.user).then(() => {
          this.redirectPage()
        }, (error) => {
          this.logining = false
          this.$message(error['body']['message'])
        })
      },
      redirectPage () {
        let redirectUrl = this.$route.query.redirect
        console.log(redirectUrl)
        if (redirectUrl) {
          this.$router.push({path: redirectUrl})
        } else {
          this.$router.push({name: 'home'})
        }
      }
    }
  }
</script>
