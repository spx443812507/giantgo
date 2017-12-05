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
              <div>开始时间：{{seminar.start_at | moment('YYYY-MM-DD HH:mm:ss')}}</div>
              <div>结束时间：{{seminar.end_at | moment('YYYY-MM-DD HH:mm:ss')}}</div>
            </div>
            <router-link :to="{name: 'seminarDetail', params: {seminarId: seminar.id}}">
              查看
            </router-link>
          </el-card>
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
    </el-row>
    <el-dialog title="创建会议" width="700px" :visible.sync="seminarEditor.visible">
      <el-form ref="seminarForm" :model="seminarForm" :rules="rules" label-width="80px">
        <el-form-item label="会议名称" prop="title" :error="seminarErrors.title">
          <el-input v-model="seminarForm.title"></el-input>
        </el-form-item>
        <el-form-item label="会议时间" :error="seminarErrors.start_at" required>
          <el-col :span="11">
            <el-form-item prop="start_at">
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
          <el-select v-model="seminarForm.entity_type_id" clearable>
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
<style lang="scss" rel="stylesheet/scss" scoped>
.seminars {
  position: relative;
  padding: 20px;
  .el-button {
    float: right;
    display: block;
  }
}

.seminar-card-container {
  padding-top: 50px;
}

.seminar-card {
  width: 395px;
  display: inline-block;
  margin: 0 15px 15px 0;
  a {
    color: #20a0ff;
  }
}

.el-dialog {
  .el-form {
    width: 85%;
    .line {
      text-align: center;
    }
  }
}

.pager {
  text-align: center;
}
</style>
<script type="text/ecmascript-6">
import navMenu from '../../components/NavMenu.vue'

export default {
  data () {
    return {
      seminars: [],
      pager: {
        currentPage: 1,
        pageSize: 9,
        total: 0
      },
      seminarForm: {
        title: '',
        start_at: '',
        end_at: '',
        entity_type_id: ''
      },
      seminarErrors: {
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
          { required: true, message: '请输入会议名称', trigger: 'change' },
          { max: 255, message: '长度不超过255个字符', trigger: 'change' }
        ],
        start_at: [
          { type: 'date', required: true, message: '请输入开始时间' }
        ],
        end_at: [
          { type: 'date', required: true, message: '请输入结束时间' }
        ]
      },
      entities: []
    }
  },
  components: { navMenu },
  methods: {
    pagerCurrentChange (val) {
      this.loadSeminars()
    },
    showSeminarEditor () {
      this.seminarEditor.visible = true
      this.$nextTick(() => {
        this.$refs['seminarForm'].resetFields()
        this.loadEntities()
      })
    },
    hideSeminarEditor () {
      this.seminarEditor.visible = false
    },
    loadSeminars () {
      this.axios.get('/api/seminars', {
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
        this.$message.warning(response['response']['data']['message'])
      })
    },
    loadEntities () {
      this.axios.get('/api/entities/seminar').then(response => {
        this.entities = response['data']
      }, response => {
        this.$message.warning(response['response']['data']['message'])
      })
    },
    createSeminar () {
      this.$refs['seminarForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/seminars', {
            entity_type_id: this.seminarForm.entity_type_id,
            title: this.seminarForm.title,
            start_at: this.$moment(this.seminarForm.start_at).format(),
            end_at: this.$moment(this.seminarForm.end_at).format()
          }).then(response => {
            this.loadSeminars()
            this.hideSeminarEditor()
          }, response => {
            this.$message.warning(response['response']['data']['message'])
          })
        }
      })
    }
  },
  mounted () {
    this.loadSeminars()
  }
}
</script>
