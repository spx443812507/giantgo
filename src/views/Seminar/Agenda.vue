<template>
  <el-col :span="20">
    <el-tabs type="border-card">
      <el-tab-pane class="agenda-pane" :label="day.label" v-for="day in days" :key="day.label">
        <el-button class="btn-create-agenda" type="primary">
          创建日程
        </el-button>
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
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss">
  .agenda-pane {
    .btn-create-agenda {
      float: right;
      margin: 0 0 10px;
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
        agendas: []
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

        if (diff <= 0) {
          diff = -1
        }
        for (let i = 0; i < diff; i++) {
          let label = this.$moment(startAt).add(i + 1, 'days').format('YYYY-MM-DD')
          days.push({
            label: label,
            agendas: this._.filter(this.agendas, agenda => {
              return this.$moment(agenda.start_at).format('YYYY-MM-DD') === label
            })
          })
        }

        return days
      }
    },
    components: {},
    methods: {
      loadAgendas () {
        this.axios.get('/api/seminars/' + this.seminarId + '/agendas').then((response) => {
          this.agendas = response['data']
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
