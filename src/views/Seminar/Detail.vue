<template>
  <el-col :span="12">
    <el-form ref="seminar" :model="seminar" :rules="rules" label-width="80px">
      <el-form-item label="会议名称" prop="title">
        <el-input v-model="seminar.title"></el-input>
      </el-form-item>
      <el-form-item label="会议时间">
        <el-col :span="11">
          <el-form-item prop="start_at">
            <el-date-picker type="datetime" placeholder="开始时间" v-model="seminar.start_at"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="end_at">
            <el-date-picker type="datetime" placeholder="结束时间" v-model="seminar.end_at"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss">
  .line {
    text-align: center;
  }
</style>
<script type="text/ecmascript-6">
  import moment from 'moment'
  import axios from 'axios'

  export default{
    data () {
      return {
        seminar: {
          id: this.$route.params.seminarId,
          title: '',
          start_at: '',
          end_at: ''
        },
        rules: {
          title: [
            {required: true, message: '请输入会议名称', trigger: 'change'},
            {max: 255, message: '长度不超过255个字符', trigger: 'change'}
          ],
          start_at: [
            {type: 'date', required: true, message: '请输入开始时间', trigger: 'change'}
          ],
          end_at: [
            {type: 'date', required: true, message: '请输入结束时间', trigger: 'change'}
          ]
        }
      }
    },
    components: {},
    methods: {
      loadSeminar () {
        axios.get('/api/seminars/' + this.seminar.id).then(response => {
          let data = response['data']

          this.seminar.title = data['title']
          this.seminar.start_at = new Date(data['start_at'])
          this.seminar.end_at = new Date(data['end_at'])
        }, response => {
          this.$message(response['data']['message'])
        })
      },
      submit () {
        this.$refs['seminar'].validate((valid) => {
          if (valid) {
            axios.put('/api/seminars/' + this.seminar.id, {
              title: this.seminar.title,
              start_at: moment.utc(this.seminar.start_at).format('YYYY-MM-DDTHH:mm:ssZ'),
              end_at: moment.utc(this.seminar.end_at).format('YYYY-MM-DDTHH:mm:ssZ')
            }).then(response => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }, response => {
              this.$message(response['data']['message'])
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.loadSeminar()
    }
  }
</script>
