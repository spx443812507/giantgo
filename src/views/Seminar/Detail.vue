<template>
  <el-col :span="12">
    <el-form ref="seminar" :model="seminar" :rules="rules" label-width="80px">
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
      <el-form-item v-for="attribute in attributes" :label="attribute.frontend_label"
                    :prop="attribute.attribute_code" :key="attribute.id">
        <el-input v-model="seminar[attribute.attribute_code]"></el-input>
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
  /* eslint-disable one-var */

  import moment from 'moment'
  import axios from 'axios'
  import entityAttributeValue from '../../components/EntityAttributeValue.vue'

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
        },
        entities: [],
        attributes: []
      }
    },
    components: {entityAttributeValue},
    methods: {
      loadSeminar () {
        axios.get('/api/seminars/' + this.seminar.id).then(response => {
          let data = response['data']

          this.seminar.title = data['title']
          this.seminar.start_at = new Date(data['start_at'])
          this.seminar.end_at = new Date(data['end_at'])
          this.seminar.entity_type_id = data['entity_type_id']
          if (data['attributes'] && data['attributes'].length) {
            this.initAttributes(data['attributes'])
          }
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
      loadAttributes (entityTypeId) {
        axios.get('/api/attributes?entity_type_id' + entityTypeId).then(response => {
          this.initAttributes(response['data'])
        }, response => {
          this.$message(response['data']['message'])
        })
      },
      initAttributes (attributes) {
        this.attributes = attributes

        for (let i = 0; i < this.attributes.length; i++) {
          let attribute = this.attributes[i], attributeCode = attribute['attribute_code']
          this.seminar[attributeCode] = ''

          if (attribute['is_required']) {
            this.rules[attributeCode] = [
              {required: true, message: '请输入' + attribute['frontend_label'], trigger: 'change'}
            ]
          }
        }
      },
      submit () {
        this.$refs['seminar'].validate((valid) => {
          if (valid) {
//            let data = this.seminar
//            for (let item in this.seminar) {
//              if (this.seminar.hasOwnProperty(item)) {
//                if (Object.prototype.toString.call(this.seminar[item]) === '[object Date]') {
//                  data[item] = moment.utc(this.seminar[item]).format('YYYY-MM-DDTHH:mm:ssZ')
//                }
//              }
//            }
            axios.put('/api/seminars/' + this.seminar.id, {
              entity_type_id: this.seminar.entity_type_id,
              seminar: {
                title: this.seminar.title,
                start_at: moment.utc(this.seminar.start_at).format('YYYY-MM-DDTHH:mm:ssZ'),
                end_at: moment.utc(this.seminar.end_at).format('YYYY-MM-DDTHH:mm:ssZ')
              }
            }).then(response => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }).catch(error => {
              if (error.status === 422) {
                this.$message({
                  message: error['response']['data'],
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: error['response']['data']['message'],
                  type: 'warning'
                })
              }
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.loadSeminar()
      this.loadEntities()
    }
  }
</script>
