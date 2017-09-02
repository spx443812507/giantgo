<template>
  <div>
    <el-button class="btn-create" type="primary" @click="showEntityEditor">
      创建模型
    </el-button>
    <div class="entity-card-container">
      <el-card class="entity-card" v-for="entityType in agendaEntityTypes" :key="entityType.id">
        <div>
          <div>模型名称：{{entityType.entity_type_name}}</div>
          <div>会议数量：{{entityType.entity_instance_count}}</div>
        </div>
        <router-link :to="{name: 'entityAgendaDetail', params: {entityTypeId: entityType.id}}">
          查看
        </router-link>
      </el-card>
    </div>
    <el-dialog title="创建" size="small" v-model="entityEditor.visible">
      <el-form class="entity-dialog-form" ref="entityForm" :model="entityForm" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="entity_type_name" :error="entityErrors.entity_type_name">
          <el-input v-model="entityForm.entity_type_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description" :error="entityErrors.description">
          <el-input v-model="entityForm.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="hideEntityEditor">取消</el-button>
        <el-button type="primary" @click.native="createEntity" :loading="entityEditor.isSubmitting">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .entity-card-container {
    padding-top: 50px;
  }

  .entity-card {
    width: 480px;
    display: inline-block;
    margin: 0 15px 15px 0;
    a {
      color: #20a0ff;
    }
  }

  .btn-create {
    float: right;
    display: block;
  }
</style>
<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        agendaEntityTypes: [],
        entityForm: {
          entity_type_name: '',
          description: ''
        },
        entityErrors: {
          entity_type_name: '',
          description: ''
        },
        entityEditor: {
          visible: false,
          isSubmitting: false
        },
        rules: {
          entity_type_name: [
            {required: true, message: '请输入模型名称'},
            {max: 255, message: '长度不超过255个字符'}
          ]
        }
      }
    },
    components: {},
    methods: {
      showEntityEditor () {
        this.entityEditor.visible = true
      },
      hideEntityEditor () {
        this.entityEditor.visible = false
      },
      createEntity () {
        this.$refs['entityForm'].validate((valid) => {
          if (valid) {
            this.axios.post('api/entities', {
              entity_type_name: this.entityForm.entity_type_name,
              entity_type_code: 'agenda',
              description: this.entityForm.description
            }).then(response => {
              this.hideEntityEditor()
              this.loadAgendaEntity()
            }, response => {
              if (response['response']['status'] === 422) {
                this._.forIn(response['response']['data']['error'], (value, key) => {
                  this.entityErrors[key] = value[0]['message']
                })
              } else {
                this.$message(response['response']['data']['message'])
              }
            })
          }
        })
      },
      loadAgendaEntity () {
        this.axios.get('/api/entities/agenda').then(response => {
          this.agendaEntityTypes = response['data']
        }, response => {
          this.$message(response['response']['data']['message'])
        })
      }
    },
    mounted () {
      this.loadAgendaEntity()
    }
  }
</script>
