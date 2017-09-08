<template>
  <el-menu :default-active="currentIndex">
    <el-menu-item v-for="(menu, index) in menus" :key="menu.title" :index="index + ''">
      <router-link :to="menu.url">
        <i :class="menu.icon"></i>{{menu.title}}
      </router-link>
    </el-menu-item>
  </el-menu>
</template>
<style lang="scss" rel="stylesheet/scss" scoped>
  .el-menu {
    height: 100%;
    .el-menu-item a {
      display: block;
      .active {
        color: #20a0ff;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  export default{
    name: 'seminar-menu',
    data () {
      return {
        seminarId: this.$route.params.seminarId,
        currentIndex: ''
      }
    },
    components: {},
    created () {
      this.routeChange()
    },
    computed: {
      menus () {
        let seminarId = this.seminarId
        return [
          {
            title: '基础信息',
            url: {
              name: 'seminarDetail',
              params: {seminarId: seminarId}
            },
            icon: 'el-icon-message'
          }, {
            title: '联系人',
            url: {
              name: 'seminarContact',
              params: {seminarId: seminarId}
            },
            icon: 'el-icon-fa-users'
          }, {
            title: '会议日程',
            url: {
              name: 'seminarAgenda',
              params: {seminarId: seminarId}
            },
            icon: 'el-icon-fa-calendar'
          }, {
            title: '演讲嘉宾',
            url: {
              name: 'seminarSpeaker',
              params: {seminarId: seminarId}
            },
            icon: 'el-icon-fa-user-circle-o'
          }, {
            title: '签到点',
            url: {
              name: 'seminarCheckin',
              params: {seminarId: seminarId}
            },
            icon: 'el-icon-fa-check-square-o'
          }
        ]
      }
    },
    watch: {
      '$route': 'routeChange'
    },
    methods: {
      routeChange () {
        this.currentIndex = this._.findIndex(this.menus, menu => {
          return !!this._.find(this.$route.matched, matched => {
            return matched.name === menu.url.name
          })
        }).toString()
      }
    },
    mounted () {
    }
  }
</script>
