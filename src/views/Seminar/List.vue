<template>
  <div class="wrapper">
    <header>
      <nav-menu></nav-menu>
    </header>
    <el-row class="container">
      <div class="seminars">
        <el-button type="primary" @click="showSeminarEditor">
          创建会议
        </el-button>
        <div class="seminar-card-container">
          <el-card class="seminar-card" v-for="seminar in seminars" :key="seminar.id">
            <div>
              <div>会议名称：{{seminar.title}}</div>
            </div>
            <router-link :to="{name: 'seminarDetail', params: {seminarId: seminar.id}}">
              查看
            </router-link>
          </el-card>
        </div>
      </div>
      <div class="pager">
        <el-pagination
          @size-change="pagerSizeChange"
          @current-change="pagerCurrentChange"
          :current-page.sync="pager.currentPage"
          :page-size="pager.pageSize"
          layout="total, prev, pager, next"
          :total="pager.total">
        </el-pagination>
      </div>
    </el-row>
    <el-dialog title="创建会议" size="small" v-model="seminarEditor.visible">
      <el-form class="seminar-editor" ref="seminar" :model="seminar" :rules="rules" label-width="80px">
        <el-form-item label="会议名称" prop="title">
          <el-input v-model="seminar.title"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" required>
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
        <el-form-item label="会议类型" prop="entity_type_id">
          <el-select v-model="seminar.entity_type_id" placeholder="请选择">
            <el-option
              v-for="entity in entities"
              :key="entity.id"
              :label="entity.entity_type_name"
              :value="entity.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideSeminarEditor">取消</el-button>
        <el-button type="primary" @click.native="createSeminar" :loading="seminarEditor.isSubmitting">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss">
  .seminars {
    position: relative;
    margin-top: 10px;
    .el-button {
      float: right;
      margin-right: 20px;
      display: block;
    }
  }

  .seminar-card-container {
    text-align: center;
    padding-top: 50px;
  }

  .seminar-card {
    width: 480px;
    display: inline-block;
    margin: 0 15px 15px 0;
    a {
      color: #20a0ff;
    }
  }

  .seminar-editor {
    width: 85%;
    .line {
      text-align: center;
    }
  }

  .pager {
    text-align: center;
  }
</style>
<script type="text/ecmascript-6">
  import axios from 'axios'
  import moment from 'moment'
  import navMenu from '../../components/NavMenu.vue'

  export default{
    data () {
      return {
        seminars: [],
        pager: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        seminar: {
          title: '',
          start_at: '',
          end_at: '',
          entity_type_id: ''
        },
        seminarEditor: {
          visible: false,
          isSubmitting: false
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
        },
        entities: []
      }
    },
    components: {navMenu},
    methods: {
      pagerSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      pagerCurrentChange (val) {
        this.loadSeminars()
      },
      resetSeminarEditor () {
        this.seminar.title = ''
        this.seminar.start_at = ''
        this.seminar.end_at = ''
      },
      showSeminarEditor () {
        this.seminarEditor.visible = true
        this.resetSeminarEditor()
        this.loadEntities()
      },
      hideSeminarEditor () {
        this.seminarEditor.visible = false
      },
      loadSeminars () {
        axios.get('/api/seminars', {
          params: {
            page: this.pager.currentPage,
            per_page: this.pager.pageSize
          }
        }).then(response => {
          let data = response['data']
          this.seminars = data['data']
          this.pager.currentPage = data['current_page']
          this.pager.total = data['total']
        }, response => {
          this.$message(response['data']['message'])
        })
      },
      loadEntities () {
        axios.get('/api/entities/seminar').then(response => {
          this.entities = response['data']
        }, response => {
          this.$message(response['data']['message'])
        })
      },
      createSeminar () {
        this.$refs['seminar'].validate((valid) => {
          if (valid) {
            axios.post('/api/seminars', {
              entity_type_id: this.seminar.entity_type_id,
              seminar: {
                title: this.seminar.title,
                start_at: moment.utc(this.seminar.start_at).format('YYYY-MM-DDTHH:mm:ssZ'),
                end_at: moment.utc(this.seminar.end_at).format('YYYY-MM-DDTHH:mm:ssZ')
              }
            }).then(response => {
              this.loadSeminars()
              this.hideSeminarEditor()
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
      this.loadSeminars()
    }
  }
</script>
