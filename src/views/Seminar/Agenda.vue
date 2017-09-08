<template>
  <el-col :span="24">
    会议时间：
    {{seminar.start_at | moment('YYYY-MM-DD HH:mm:ss')}} - {{seminar.end_at | moment('YYYY-MM-DD HH:mm:ss')}}
    <el-card class="agenda-card" v-for="(day, index) in days" :key="day.date">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">第{{index + 1}}天：{{day.date}}</span>
        <el-button class="btn-create-agenda" type="primary" @click="showAgendaEditor(null, day.date)">
          创建日程
        </el-button>
      </div>
      <el-table class="agenda-table" :data="day.agendas" stripe border style="width: 100%">
        <el-table-column prop="title" label="标题" width="300"></el-table-column>
        <el-table-column label="开始时间" width="180">
          <template scope="scope">
            {{scope.row.start_at | moment('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template scope="scope">
            {{scope.row.end_at | moment('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="演讲嘉宾" width="100">
          <template scope="scope">
            <el-popover
              :ref="'popover' + scope.row.id"
              placement="right"
              width="600"
              trigger="hover">
              <div slot="reference">
                <el-button type="text" size="small" @click="showSpeakerTransfer(scope.$index, scope.row)">
                  演讲嘉宾
                </el-button>
              </div>
              <el-table :data="scope.row.speakers" :key="Math.random()" stripe border style="width: 100%">
                <el-table-column width="180" property="name" label="姓名"></el-table-column>
                <el-table-column width="270" property="company" label="公司"></el-table-column>
                <el-table-column width="150" property="position" label="职位"></el-table-column>
              </el-table>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="small" @click="showAgendaEditor(scope.$index, day.date, scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteAgenda(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog :title="agendaEditor.title" size="small" v-model="agendaEditor.visible">
      <el-form ref="agendaForm" :model="agendaForm" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title" :error="agendaErrors.title">
          <el-input v-model="agendaForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="会议时间 " required>
          <el-col :span="11">
            <el-form-item prop="start_at" :error="agendaErrors.start_at">
              <el-time-select
                placeholder="起始时间"
                v-model="agendaForm.start_at"
                :picker-options="{start: '00:00', step: '00:15', end: '24:00'}">
              </el-time-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-form-item prop="end_at" :error="agendaErrors.end_at">
              <el-time-select
                placeholder="结束时间"
                v-model="agendaForm.end_at"
                :picker-options="{start: '00:00', step: '00:15', end: '24:00', minTime: agendaForm.start_at}">
              </el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideAgendaEditor">取消</el-button>
        <el-button type="primary" @click.native="saveAgenda" :loading="agendaEditor.isSubmitting">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="演讲嘉宾" size="small" v-model="speakerTransfer.visible">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入嘉宾姓名"
        :titles="['嘉宾列表', '已选嘉宾']"
        :props="{key: 'id', label: 'name'}"
        v-model="speakerTransfer.speakers"
        :data="speakers">
      </el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideSpeakerTransfer">取消</el-button>
        <el-button type="primary" @click.native="attachAgendaSpeakers" :loading="speakerTransfer.isSubmitting">
          保存
        </el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .agenda-card {
    width: 100%;
    margin-top: 20px;
    .btn-create-agenda {
      float: right;
      display: block;
    }
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

  import { mapGetters } from 'vuex'

  export default{
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        agendas: [],
        agendaForm: {
          title: '',
          start_at: '',
          end_at: ''
        },
        agendaErrors: {
          title: '',
          start_at: '',
          end_at: ''
        },
        agendaEditor: {
          title: '',
          visible: false,
          isSubmitting: false
        },
        rules: {
          title: [
            {required: true, message: '请输入日程名称'},
            {max: 255, message: '长度不超过255个字符'}
          ],
          start_at: [
            {required: true, message: '请输入开始时间'},
            {
              validator: (rule, value, callback) => {
                let agendaStartAt = this.$moment(this.agendaForm.date + ' ' + value)
                if (agendaStartAt.isBefore(this.seminar.start_at)) {
                  return callback(new Error('日程开始时间要晚于会议开始时间'))
                } else if (agendaStartAt.isAfter(this.seminar.end_at)) {
                  return callback(new Error('日程开始时间要不晚于会议结束时间'))
                } else {
                  callback()
                }
              }
            }
          ],
          end_at: [
            {required: true, message: '请输入结束时间'}
          ]
        },
        speakers: [],
        speakerTransfer: {
          agendaId: '',
          speakers: [],
          visible: false,
          isSubmitting: false
        },
        filterMethod (query, item) {
          return item.name.indexOf(query) > -1
        }
      }
    },
    computed: {
      ...mapGetters([
        'seminar'
      ]),
      days () {
        let startAt = this.seminar.start_at,
          endAt = this.seminar.end_at,
          diff = parseInt(Math.abs(startAt - endAt) / 1000 / 60 / 60 / 24),
          days = []
        for (let i = -1; i < diff; i++) {
          let date = this.$moment(startAt).add(i + 1, 'days').format('YYYY-MM-DD')
          days.push({
            date: date,
            agendas: this._.filter(this.agendas, agenda => {
              return this.$moment(agenda.start_at).format('YYYY-MM-DD') === date
            })
          })
        }
        return days
      }
    },
    components: {},
    methods: {
      showAgendaEditor (index, date, row) {
        this.agendaEditor.visible = true
        this.$nextTick(() => {
          this.$refs['agendaForm'].resetFields()
          this.agendaForm.date = date
          if (row && row.id) {
            this.agendaForm.id = row.id
            this.agendaForm.title = row.title
            this.agendaForm.start_at = this.$moment(row.start_at).format('HH:mm')
            this.agendaForm.end_at = this.$moment(row.end_at).format('HH:mm')
            this.agendaEditor.title = '编辑'
          } else {
            this.agendaForm.id = ''
            this.agendaForm.title = ''
            this.agendaForm.start_at = ''
            this.agendaForm.end_at = ''
            this.agendaEditor.title = '创建'
          }
        })
      },
      hideAgendaEditor () {
        this.agendaEditor.visible = false
      },
      showSpeakerTransfer (index, row) {
        this.speakerTransfer.agendaId = row.id
        this.speakerTransfer.visible = true
        this.speakerTransfer.speakers = row.speakerIds
        this.loadSpeakers()
      },
      hideSpeakerTransfer () {
        this.speakerTransfer.visible = false
      },
      saveAgenda () {
        this.$refs['agendaForm'].validate((valid) => {
          if (valid) {
            let statAt = this.agendaForm.date + ' ' + this.agendaForm.start_at,
              endAt = this.agendaForm.date + ' ' + this.agendaForm.end_at,
              url = '/api/seminars/' + this.seminarId + '/agendas',
              method = 'post',
              data = {
                entity_type_id: this.agendaForm.entity_type_id,
                title: this.agendaForm.title,
                start_at: this.$moment(statAt).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ'),
                end_at: this.$moment(endAt).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ')
              }
            if (this.agendaForm.id) {
              method = 'put'
              url += '/' + this.agendaForm.id
            }
            this.axios[method](url, data).then(response => {
              this.loadAgendas()
              this.hideAgendaEditor()
            }, response => {
              if (response['response']['status'] === 422) {
                this._.forIn(response['response']['data']['error'], (value, key) => {
                  this.agendaErrors[key] = value[0]['message']
                })
              } else {
                this.$message(response['response']['data']['message'])
              }
            })
          }
        })
      },
      deleteAgenda (index, row) {
        this.$confirm('此操作将删除日程：' + row.title + '，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.delete('/api/seminars/' + this.seminarId + '/agendas/' + row.id).then(response => {
            this.loadAgendas()
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
      },
      attachAgendaSpeakers () {
        this.axios.put('/api/seminars/' + this.seminarId + '/agendas/' + this.speakerTransfer.agendaId + '/speakers', {
          speakers: this.speakerTransfer.speakers
        }).then((response) => {
          this.loadAgendas()
          this.hideSpeakerTransfer()
        }, (response) => {
          this.$message(response['response']['data']['message'])
        })
      },
      loadAgendas () {
        this.axios.get('/api/seminars/' + this.seminarId + '/agendas').then((response) => {
          this.agendas = response['data']
        }, (response) => {
          this.$message(response['response']['data']['message'])
        })
      },
      loadSpeakers () {
        this.axios.get('/api/seminars/' + this.seminarId + '/speakers').then((response) => {
          this.speakers = response['data']
        }, (response) => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      this.loadAgendas()
    }
  }
</script>
