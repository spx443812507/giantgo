<template>
  <el-menu mode="vertical" :default-active="currentIndex">
    <el-menu-item-group v-for="(menu, menuIndex) in menus" :key="menu.title" :title="menu.title">
      <el-menu-item v-for="(item, itemIndex) in menu.children" :key="item.title" :index="menuIndex + '-' + itemIndex">
        <router-link :to="item.url"><i :class="item.icon"></i>{{item.title}}</router-link>
      </el-menu-item>
    </el-menu-item-group>
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
    name: 'entity-menu',
    data () {
      return {
        currentIndex: '1',
        menus: [
          {
            title: '人物模型',
            children: [
              {
                title: '联系人模型',
                url: '/entities/contact',
                icon: 'el-icon-fa-users'
              }
            ]
          }, {
            title: '会议模型',
            children: [
              {
                title: '简介模型',
                url: '/entities/seminar',
                icon: 'el-icon-fa-newspaper-o'
              }, {
                title: '嘉宾模型',
                url: '/entities/speaker',
                icon: 'el-icon-fa-user-circle-o'
              }, {
                title: '日程模型',
                url: '/entities/agenda',
                icon: 'el-icon-fa-calendar'
              }
            ]
          }
        ]
      }
    },
    components: {},
    created () {
      this.routeChange()
    },
    watch: {
      '$route': 'routeChange'
    },
    methods: {
      routeChange () {
        // flat the menus, append index to every children
        let menus = this._.flatMap(this.menus, (menu, menuIndex) => {
          return this._.map(menu.children, (item, itemIndex) => {
            item['index'] = menuIndex + '-' + itemIndex
            return item
          })
        })
        // find matched menu
        let menu = this._.find(menus, menu => {
          return this.$route.path === menu.url
        })
        if (menu) {
          this.currentIndex = menu['index']
        }
      }
    },
    mounted () {
    }
  }
</script>
