<template>
  <el-col :span="24">
    <div class="speakers">
      <el-button class="btn-create" type="primary" @click="showSpeakerEditor">
        创建嘉宾
      </el-button>
      <div>
        <el-table class="agenda-table"
                  :data="speakers"
                  v-loading.body="pager.loading"
                  stripe border style="width: 100%">
          <el-table-column prop="name" label="姓名" width="200"></el-table-column>
          <el-table-column prop="company" label="公司" width="300"></el-table-column>
          <el-table-column prop="position" label="职位" width="200"></el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button size="small" @click="showSpeakerEditor(scope.$index, scope.row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="deleteSpeaker(scope.$index, scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pager">
      <el-pagination
        @current-change="pagerCurrentChange"
        :current-page.sync="pager.currentPage"
        :page-size="pager.pageSize"
        layout="total, prev, pager, next"
        :total="pager.total">
      </el-pagination>
    </div>
    <el-dialog :title="speakerEditor.title" size="small" v-model="speakerEditor.visible">
      <el-form class="speaker-dialog-form" ref="speakerForm" :model="speakerForm" :rules="rules" label-width="80px">
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            action="/api/files/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="speakerForm.avatar" :src="speakerForm.avatar" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :error="speakerErrors.name">
          <el-input v-model="speakerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="company" :error="speakerErrors.company">
          <el-input v-model="speakerForm.company"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position" :error="speakerErrors.position">
          <el-input v-model="speakerForm.position"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="title" :error="speakerErrors.profile">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" v-model="speakerForm.profile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideSpeakerEditor">取消</el-button>
        <el-button type="primary" @click.native="saveSpeaker" :loading="speakerEditor.isSubmitting">保存</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .speakers {
    .btn-create {
      float: right;
      margin-bottom: 10px;
    }
  }

  .pager {
    float: right;
    margin-top: 10px;
  }

  .speaker-dialog-form {
    width: 85%;
  }

  .avatar-uploader {
    img {
      width: 100%;
      height: auto;
      max-height: 100%;
    }
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        speakers: [],
        pager: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          loading: false
        },
        seminar: {
          title: '',
          start_at: '',
          end_at: '',
          entity_type_id: ''
        },
        speakerForm: {
          id: '',
          name: '',
          avatar: '',
          company: '',
          position: '',
          profile: '',
          entity_type_id: ''
        },
        speakerErrors: {
          name: '',
          avatar: '',
          company: '',
          position: '',
          profile: '',
          entity_type_id: ''
        },
        speakerEditor: {
          title: '',
          visible: false,
          isSubmitting: false
        },
        rules: {
          name: [
            {required: true, message: '请输入嘉宾姓名'},
            {max: 255, message: '长度不超过255个字符'}
          ],
          company: [
            {required: true, message: '请输入公司'},
            {max: 255, message: '长度不超过255个字符'}
          ],
          position: [
            {required: true, message: '请输入职位'},
            {max: 255, message: '长度不超过255个字符'}
          ]
        },
        entities: []
      }
    },
    components: {},
    methods: {
      pagerCurrentChange (val) {
        this.loadSpeakers()
      },
      handleAvatarSuccess (res, file) {
        this.speakerForm.avatar = file.response
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      showSpeakerEditor (index, row) {
        this.speakerEditor.visible = true
        this.$nextTick(() => {
          this.$refs['speakerForm'].resetFields()
          if (row && row.id) {
            this.speakerForm.id = row.id
            this.speakerForm.name = row.name
            this.speakerForm.avatar = row.avatar
            this.speakerForm.company = row.company
            this.speakerForm.position = row.position
            this.speakerForm.profile = row.profile
            this.speakerEditor.title = '编辑'
          } else {
            this.speakerForm.id = ''
            this.speakerForm.name = ''
            this.speakerForm.avatar = ''
            this.speakerForm.company = ''
            this.speakerForm.position = ''
            this.speakerForm.profile = ''
            this.speakerEditor.title = '创建'
          }
        })
        this.loadEntities()
      },
      hideSpeakerEditor () {
        this.speakerEditor.visible = false
      },
      loadSpeakers () {
        this.pager.loading = true
        this.axios.get('/api/seminars/' + this.seminarId + '/speakers', {
          params: {
            page: this.pager.currentPage,
            per_page: this.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.speakers = data['data']
          this.pager.currentPage = data['current_page']
          this.pager.total = data['total']
          this.pager.loading = false
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      },
      loadEntities () {
        this.axios.get('/api/entities/speaker').then(response => {
          this.entities = response['data']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      },
      saveSpeaker () {
        this.$refs['speakerForm'].validate((valid) => {
          if (valid) {
            let url = '/api/seminars/' + this.seminarId + '/speakers',
              method = 'post',
              data = {
                entity_type_id: this.speakerForm.entity_type_id,
                avatar: this.speakerForm.avatar,
                name: this.speakerForm.name,
                company: this.speakerForm.company,
                position: this.speakerForm.position,
                profile: this.speakerForm.profile
              }
            if (this.speakerForm.id) {
              method = 'put'
              url += '/' + this.speakerForm.id
            }
            this.axios[method](url, data).then(response => {
              this.loadSpeakers()
              this.hideSpeakerEditor()
            }, response => {
              if (response['response']['status'] === 422) {
                this._.forIn(response['response']['data']['error'], (value, key) => {
                  this.speakerErrors[key] = value[0]['message']
                })
              } else {
                this.$message(response['response']['data']['message'])
              }
            })
          }
        })
      },
      deleteSpeaker (index, row) {
        this.$confirm('此操作将删除此嘉宾以及会议日程中已设置的嘉宾：' + row.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/seminars/' + this.seminarId + '/speakers/' + row.id).then(response => {
            this.loadSpeakers()
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
      this.loadSpeakers()
    }
  }
</script>
