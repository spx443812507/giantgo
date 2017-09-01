<template>
  <el-col :span="24">
    <div class="checkins">
      <el-button class="btn-create" type="primary" @click="showCheckinEditor">
        创建签到点
      </el-button>
      <div>
        <el-table
          class="checkin-table"
          :data="checkins"
          v-loading.body="checkinForm.loading"
          stripe border style="width: 100%">
          <el-table-column prop="title" label="标题" width="200"></el-table-column>
          <el-table-column prop="staff_name" label="工作人员姓名" width="300"></el-table-column>
          <el-table-column prop="staff_mobile" label="工作人员电话" width="200"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" @click="showCheckinEditor(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteCheckin(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="checkinEditor.title" size="small" v-model="checkinEditor.visible">
      <el-form class="checkin-dialog-form" ref="checkinForm" :model="checkinForm" :rules="rules" label-width="100px">
        <el-form-item label="签到点名称" prop="title" :error="checkinErrors.title">
          <el-input v-model="checkinForm.title"></el-input>
        </el-form-item>
        <el-form-item label="工作人员姓名" prop="staff_name" :error="checkinErrors.staff_name">
          <el-input v-model="checkinForm.staff_name"></el-input>
        </el-form-item>
        <el-form-item label="工作人员手机" prop="staff_mobile" :error="checkinErrors.staff_mobile">
          <el-input v-model="checkinForm.staff_mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideCheckinEditor">取消</el-button>
        <el-button type="primary" @click.native="saveCheckin" :loading="checkinEditor.isSubmitting">保存</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .checkins {
    .btn-create {
      float: right;
      margin-bottom: 10px;
    }
  }

  .checkin-dialog-form {
    width: 85%;
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        checkins: [],
        checkinForm: {
          id: '',
          title: '',
          staff_name: '',
          staff_mobile: ''
        },
        checkinErrors: {
          title: '',
          staff_name: '',
          staff_mobile: ''
        },
        checkinEditor: {
          title: '',
          visible: false,
          isSubmitting: false
        },
        rules: {
          title: [
            {required: true, message: '请输入签到点名称'},
            {max: 255, message: '长度不超过255个字符'}
          ]
        }
      }
    },
    components: {},
    methods: {
      showCheckinEditor (index, row) {
        this.checkinEditor.visible = true

        this.$nextTick(() => {
          this.$refs['checkinForm'].resetFields()
          if (row && row.id) {
            this.checkinForm.id = row.id
            this.checkinForm.title = row.title
            this.checkinForm.staff_name = row.staff_name
            this.checkinForm.staff_mobile = row.staff_mobile
            this.checkinEditor.title = '编辑'
          } else {
            this.checkinForm.id = ''
            this.checkinForm.title = ''
            this.checkinForm.staff_name = ''
            this.checkinForm.staff_mobile = ''
            this.checkinEditor.title = '创建'
          }
        })
      },
      hideCheckinEditor () {
        this.checkinEditor.visible = false
      },
      loadCheckins () {
        this.axios.get('/api/seminars/' + this.seminarId + '/checkins').then(response => {
          this.checkins = response['data']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      },
      saveCheckin () {
        this.$refs['checkinForm'].validate((valid) => {
          if (valid) {
            let url = '/api/seminars/' + this.seminarId + '/checkins',
              method = 'post',
              data = {
                title: this.checkinForm.title,
                staff_name: this.checkinForm.staff_name,
                staff_mobile: this.checkinForm.staff_mobile
              }
            if (this.checkinForm.id) {
              method = 'put'
              url += '/' + this.checkinForm.id
            }
            this.axios[method](url, data).then(response => {
              this.loadCheckins()
              this.hideCheckinEditor()
            }).catch(response => {
              if (response['response']['status'] === 422) {
                this._.forIn(response['response']['data']['error'], (value, key) => {
                  this.checkinErrors[key] = value[0]['message']
                })
              } else {
                this.$message(response['response']['data']['message'])
              }
            })
          }
        })
      },
      deleteCheckin (index, row) {
        this.$confirm('此操作将删除此签到点：' + row.title + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/seminars/' + this.seminarId + '/checkins/' + row.id).then(response => {
            this.loadCheckins()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }, response => {
            this.$message(response['response']['data']['message'])
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    mounted () {
      this.loadCheckins()
    }
  }
</script>
