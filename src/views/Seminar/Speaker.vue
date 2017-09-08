<template>
  <el-col :span="24">
    <el-card class="speaker-card" v-for="entity in entitySpeakers" :key="entity.id">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">嘉宾分类：{{entity.entity_type_name}}</span>
        <el-button class="btn-create-speaker" type="primary" @click="showSpeakerEditor(null, null, entity)">
          创建嘉宾
        </el-button>
      </div>
      <el-table
        class="agenda-table"
        :data="entity.speakers"
        stripe border style="width: 100%">
        <el-table-column prop="name" label="姓名" width="200"></el-table-column>
        <el-table-column prop="company" label="公司" width="300"></el-table-column>
        <el-table-column prop="position" label="职位" width="200"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showSpeakerEditor(scope.$index, scope.row, entity)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteSpeaker(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="speakerEditor.title" size="small" :visible.sync="speakerEditor.visible">
      <el-form ref="speakerForm" :model="speakerForm" :rules="rules" label-width="80px">
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
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="speakerForm.profile"></el-input>
        </el-form-item>
        <el-form-item
          v-for="(attribute, index) in speakerForm.attributes"
          :label="attribute.frontend_label"
          :prop="'attributes.' + index + '.value'"
          :key="attribute.id"
          :rules="attribute.rules"
          :error="attribute.error">
          <el-input v-model="attribute.value" v-if="attribute.frontend_input === 'text'"></el-input>
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="attribute.value"
            v-if="attribute.frontend_input === 'textarea'">
          </el-input>
          <el-input-number v-model="attribute.value" v-if="attribute.frontend_input === 'number'" auto-complete="off">
          </el-input-number>
          <el-date-picker type="datetime" v-model="attribute.value" v-if="attribute.frontend_input === 'datetime'">
          </el-date-picker>
          <el-select v-model="attribute.value" placeholder="请选择" v-if="attribute.frontend_input === 'select'">
            <el-option
              v-for="item in attribute.options"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
          <el-checkbox-group v-model="attribute.value" v-if="attribute.frontend_input === 'checkbox'">
            <el-checkbox
              v-for="item in attribute.options"
              :label="item.id"
              :key="item.id">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
          <el-radio-group v-model="attribute.value" v-if="attribute.frontend_input === 'radio'">
            <el-radio
              v-for="item in attribute.options"
              :label="item.id"
              :key="item.id">
              {{item.label}}
            </el-radio>
          </el-radio-group>
          <el-switch
            v-model="attribute.value"
            v-if="attribute.frontend_input === 'switch'"
            on-text=""
            off-text="">
          </el-switch>
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
  .speaker-card {
    width: 100%;
    margin-top: 20px;
    .btn-create-speaker {
      float: right;
      display: block;
    }
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

  import entityAttribute from '../../components/EntityAttribute.vue'
  import attribute from '../../mixins/attribute'

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        speakers: [],
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
          entity_type_id: '',
          attributes: []
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
    components: {entityAttribute},
    mixins: [attribute],
    computed: {
      entitySpeakers () {
        return this._.map(this.entities, entity => {
          entity.speakers = this._.filter(this.speakers, speaker => {
            return entity.id === speaker.entity_type_id
          })
          return entity
        })
      }
    },
    methods: {
      handleAvatarSuccess (res, file) {
        this.speakerForm.avatar = file.response
      },
      beforeAvatarUpload (file) {
        const isImage = /(.jpg|.png|.gif|.jpeg)$/.test(file.name.toLowerCase())
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isImage) {
          this.$message.error('上传头像图片只能是 JPG,PNG,GIF,JPEG 格式!')
        } else if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isImage && isLt2M
      },
      showSpeakerEditor (index, row, entity) {
        this.speakerEditor.visible = true
        this.$nextTick(() => {
          this.$refs['speakerForm'].resetFields()
          this.speakerForm.attributes = this.formatAttribute(entity.attributes, row)
          if (row && row.id) {
            this.speakerForm.id = row.id
            this.speakerForm.name = row.name
            this.speakerForm.avatar = row.avatar
            this.speakerForm.company = row.company
            this.speakerForm.position = row.position
            this.speakerForm.profile = row.profile
            this.speakerForm.entity_type_id = row.entity_type_id
            this.speakerEditor.title = '编辑'
          } else {
            this.speakerForm.id = ''
            this.speakerForm.name = ''
            this.speakerForm.avatar = ''
            this.speakerForm.company = ''
            this.speakerForm.position = ''
            this.speakerForm.profile = ''
            this.speakerForm.entity_type_id = entity.id
            this.speakerEditor.title = '创建'
          }
        })
      },
      hideSpeakerEditor () {
        this.speakerEditor.visible = false
      },
      loadSpeakers () {
        this.axios.get('/api/seminars/' + this.seminarId + '/speakers').then(response => {
          this.speakers = response['data']
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
                avatar: this.speakerForm.avatar,
                name: this.speakerForm.name,
                company: this.speakerForm.company,
                position: this.speakerForm.position,
                profile: this.speakerForm.profile,
                entity_type_id: this.speakerForm.entity_type_id,
                ...this.getAttributeValue(this.speakerForm.attributes)
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
      this.loadEntities()
    }
  }
</script>
