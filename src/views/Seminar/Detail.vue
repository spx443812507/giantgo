<template>
  <el-col :span="12">
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
        <el-select v-model="seminarForm.entity_type_id" @change="entityChange" no-match-text="asd" no-data-text="asd">
          <el-option
            v-for="entity in entities"
            :key="entity.id"
            :label="entity.entity_type_name"
            :value="entity.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-for="(attribute, index) in seminarForm.attributes"
        :label="attribute.frontend_label"
        :prop="'attributes.' + index + '.value'"
        :key="attribute.id"
        :rules="attribute.rules"
        :error="attribute.error">
        <entity-attribute
          v-model="attribute.value"
          :frontend-input="attribute.frontend_input"
          :options="attribute.options">
        </entity-attribute>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .seminar-form {
    width: 100%;
    .line {
      text-align: center;
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
    mixins: [attribute],
    components: {entityAttribute},
    methods: {
      entityChange (entityTypeId) {
        for (let i = 0; i < this.entities.length; i++) {
          if (entityTypeId === this.entities[i].id) {
            this.seminarForm.attributes = this.formatAttribute(this.entities[i].attributes, this.seminarInfo)
          }
        }
      },
      loadSeminar () {
        this.axios.get('/api/seminars/' + this.seminarInfo.id).then(response => {
          this.seminarInfo = response['data']
          this.seminarForm.title = this.seminarInfo['title']
          this.seminarForm.start_at = new Date(this.seminarInfo['start_at'])
          this.seminarForm.end_at = new Date(this.seminarInfo['end_at'])
          this.seminarForm.entity_type_id = this.seminarInfo['entity_type_id'] || ''
          this.seminarForm.attributes = this.formatAttribute(this.seminarInfo['attributes'], this.seminarInfo)
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      },
      loadEntities () {
        this.axios.get('/api/entities/seminar').then(response => {
          this.entities = response['data']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      },
      submit () {
        this.$refs['seminarForm'].validate((valid) => {
          if (valid) {
            let data = {
              id: this.seminarInfo.id,
              title: this.seminarForm.title,
              start_at: this.$moment(this.seminarForm.start_at).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ'),
              end_at: this.$moment(this.seminarForm.end_at).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ'),
              entity_type_id: this.seminarForm.entity_type_id,
              ...this.getAttributeValue(this.seminarForm.attributes)
            }
            this.$store.dispatch('updateSeminar', data).then(response => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }, response => {
              if (response['response']['status'] === 422) {
                this._.forIn(response['response']['data']['error'], (value, key) => {
                  if (this._.has(this.seminarErrors, key) && value.length) {
                    this.seminarErrors[key] = value[0]['message']
                  } else {
                    this._.map(this.seminarForm.attributes, attribute => {
                      if (attribute['attribute_code'] === key && value.length) {
                        attribute['error'] = value[0]['message']
                      }
                    })
                  }
                })
              } else {
                this.$message({
                  message: response['response']['data']['message'],
                  type: 'warning'
                })
              }
            })
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
