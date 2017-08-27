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
        <el-input v-model="attribute.value" v-if="attribute.frontend_input === 'text'"></el-input>
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
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<style lang="scss" rel="stylesheet/scss">
  .seminar-form {
    width: 100%;
    .line {
      text-align: center;
    }
  }
</style>
<script type="text/ecmascript-6">
  /* eslint-disable one-var */

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
    components: {},
    methods: {
      entityChange (entityTypeId) {
        for (let i = 0; i < this.entities.length; i++) {
          if (entityTypeId === this.entities[i].id) {
            this.loadAttributes(entityTypeId, this.entities[i].attributes)
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
          this.loadAttributes(this.seminarInfo['entity_type_id'], this.seminarInfo['attributes'])
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
      loadAttributes (entityTypeId, attributes) {
        this.seminarForm.attributes = []
        this._.map(attributes, (attribute) => {
          let attributeCode = attribute['attribute_code'],
            value = this.seminarInfo[attributeCode]
          attribute['value'] = attribute['is_collection'] ? [] : ''
          attribute['rules'] = []
          attribute['error'] = ''

          if (entityTypeId === this.seminarInfo.entity_type_id && value) {
            attribute['value'] = value
          }

          if (attribute['is_required']) {
            attribute['rules'].push({required: true, message: '请输入' + attribute['frontend_label']})
          }
          if (attribute['frontend_input'] === 'number') {
            attribute['rules'].push({type: 'number', message: '请输入数字'})
          }

          if (value) {
            if (attribute['frontend_input'] === 'datetime') {
              attribute['value'] = new Date(value)
            }
          }
          this.seminarForm.attributes.push(this._.clone(attribute, true))
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
              entity_type_id: this.seminarForm.entity_type_id
            }

            for (let i = 0; i < this.seminarForm.attributes.length; i++) {
              let attribute = this.seminarForm.attributes[i], attributeCode = attribute['attribute_code']
              data[attributeCode] = attribute['value']
              if (attribute['frontend_input'] === 'datetime') {
                if (attribute['value']) {
                  data[attributeCode] = this.$moment(attribute['value']).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ')
                } else {
                  data[attributeCode] = ''
                }
              }
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
