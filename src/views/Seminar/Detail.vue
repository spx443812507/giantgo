<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">会议管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">基础信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="seminar-card">
      <div slot="header" class="seminar-card-header">
        <span style="line-height: 36px;">会议名称：{{seminar.title}}</span>
        <span><el-tag type="primary">{{seminar.entity_type_id}}</el-tag></span>
        <span class="seminar-time">
          {{seminar.start_at | moment('YYYY年MM月DD日 HH时mm分')}} -
          {{seminar.end_at | moment('YYYY年MM月DD日 HH时mm分')}}
        </span>
        <el-button class="btn-edit-seminar" type="primary" icon="edit" @click.native="showSeminarEditor">编辑</el-button>
      </div>
      <el-row v-for="attribute in seminar.attributes" :key="attribute.id">
        会议类型：{{seminar[attribute.attribute_code]}}
      </el-row>
    </el-card>
    <el-dialog title="编辑会议" width="700px" :visible.sync="seminarEditor.visible">
      <el-form class="seminar-form" ref="seminarForm" :model="seminarForm" :rules="rules" label-width="80px">
        <el-form-item label="会议名称" prop="title" :error="seminarErrors.title">
          <el-input v-model="seminarForm.title"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" required>
          <el-col :span="11">
            <el-form-item prop="start_at" :error="seminarErrors.start_at">
              <el-date-picker type="datetime" placeholder="开始时间" v-model="seminarForm.start_at"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="end_at" :error="seminarErrors.end_at">
              <el-date-picker type="datetime" placeholder="结束时间" v-model="seminarForm.end_at"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="会议类型" prop="entity_type_id" :error="seminarErrors.entity_type_id">
          <el-select v-model="seminarForm.entity_type_id" @change="renderEntityAttributes">
            <el-option
              v-for="entity in entities"
              :key="entity.id"
              :label="entity.entity_type_name"
              :value="entity.id">
            </el-option>
          </el-select>
        </el-form-item>
        <entity-attribute ref="attributes" :attributes="seminarForm.attributes"></entity-attribute>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native="saveSeminar" :loading="seminarEditor.isSubmitting">保存</el-button>
        <el-button @click.native="hideSeminarEditor">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .seminar-form {
    .line {
      text-align: center;
    }
  }

  .seminar-card {
    margin-top: 20px;
    .seminar-card-header {
      .seminar-time {
        font-size: 12px;
        color: gray;
      }

      .btn-edit-seminar {
        float: right;
        display: block;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */
  import { mapGetters } from 'vuex'
  import entityAttribute from '../../components/EntityAttribute.vue'

  export default {
    data () {
      return {
        seminarInfo: {
          id: this.$route.params.seminarId
        },
        seminarForm: {
          title: '',
          start_at: '',
          end_at: '',
          entity_type_id: '',
          attributes: []
        },
        seminarErrors: {
          title: '',
          start_at: '',
          end_at: ''
        },
        seminarEditor: {
          visible: false,
          isSubmitting: false
        },
        rules: {
          title: [
            {required: true, message: '请输入会议名称'},
            {max: 255, message: '长度不超过255个字符'}
          ],
          start_at: [
            {type: 'date', required: true, message: '请输入开始时间'}
          ],
          end_at: [
            {type: 'date', required: true, message: '请输入结束时间'}
          ]
        },
        entities: []
      }
    },
    components: {entityAttribute},
    computed: {
      ...mapGetters([
        'seminar'
      ])
    },
    methods: {
      showSeminarEditor () {
        this.seminarEditor.visible = true
        this.$nextTick(() => {
          this.$refs['seminarForm'].resetFields()
          this.seminarForm.title = this.seminar.title
          this.seminarForm.start_at = new Date(this.seminar.start_at)
          this.seminarForm.end_at = new Date(this.seminar.end_at)
          this.seminarForm.entity_type_id = this.seminar.entity_type_id || ''
          this.renderEntityAttributes(this.seminarForm.entity_type_id)
        })
      },
      hideSeminarEditor () {
        this.seminarEditor.visible = false
      },
      renderEntityAttributes (entityTypeId) {
        let entity = this._.find(this.entities, {id: entityTypeId}) || {}
        this.seminarForm.attributes = this.$refs['attributes'].format(entity.attributes || [], this.seminar)
      },
      loadEntities () {
        this.axios.get('/api/entities/seminar').then(response => {
          this.entities = response['data']
        }, response => {
          this.$message.warning(response['response']['data']['message'])
        })
      },
      saveSeminar () {
        this.$refs['seminarForm'].validate((valid) => {
          if (valid) {
            let data = {
              id: this.seminarInfo.id,
              title: this.seminarForm.title,
              start_at: this.$moment(this.seminarForm.start_at).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ'),
              end_at: this.$moment(this.seminarForm.end_at).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ'),
              entity_type_id: this.seminarForm.entity_type_id,
              ...this.$refs['attributes'].values()
            }

            this.$store.dispatch('updateSeminar', data).then(response => {
              this.$message.success('保存成功')
              this.seminarEditor.visible = false
            }, response => {
              this.$message.warning(response['response']['data']['message'])
            })
          }
        })
      }
    },
    mounted () {
      this.loadEntities()
    }
  }
</script>
