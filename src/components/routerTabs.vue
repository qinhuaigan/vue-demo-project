<template>
  <div class="routerTabs">
    <ul class="tabsList clearfix">
      <li class="tabItem" @click="go(item, index)" :class="{active: current === index}" v-for="(item, index) in tabs" :key="`${item.path}_${index}`">
        <span>{{item.name}}</span>
        <i class="el-icon-close" v-if="tabs.length > 1 || (tabs.length === 0 && redirect)" @click.stop="closeTab(index)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
/*
    redirect：{ // 重定向 URL，当关闭了 "最后一个 tab" 的时候，要跳转到的页面，如果不传，则最后一个 tab 不能删除
      path: ***,
      query: {}, // 跳转到该页面要传递的参数（选填）
      parms: {}  // 跳转到该页面要传递的参数（选填）
    }
  */
export default {
  name: 'routerTabs',
  comments: {

  },
  props: ['redirect'],
  data () {
    return {
      tabs: [],
      current: 0
    }
  },
  watch: {
    '$route': 'routeChange'
  },
  methods: {
    routeChange () {
      if (this.$route.query.notCreateTab) {
        // 跳转到新的 $route 时，如果 params 中加入 removeTab 参数，说明不需要产生 tabItem
        return
      }
      if (!this.tabs || this.tabs.length === 0) {
        this.tabs = [{
          path: this.$route.path,
          parms: this.$route.params,
          query: this.$route.query,
          name: this.$route.name
        }]
        this.current = 0
      } else {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].path === this.$route.path) {
            this.current = i
            break
          } else if (i === this.tabs.length - 1) {
            this.tabs.push({
              path: this.$route.path,
              parms: this.$route.params,
              query: this.$route.query,
              name: this.$route.name
            })
            this.current = i
          }
        }
      }
    },
    go (item, index) { // 跳转到指定 tab
      this.$router.push({
        path: item.path,
        params: item.path,
        query: item.query
      })
    },
    closeTab (index) {
      let isCurrent = false // 记录关闭的是否是当前页面
      if (this.current === index) {
        // 关闭的是当前页面
        isCurrent = true
      }
      this.tabs.splice(index, 1)
      // 更新 current 的值
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].path === this.$route.path) {
          this.current = i
          break
        }
      }
      if (isCurrent) {
        let gotoPage = this.tabs[this.tabs.length - 1]
        if (gotoPage) {
          this.$router.push({
            path: gotoPage.path,
            query: gotoPage.query,
            params: gotoPage.params
          })
        } else {
          // 关闭的是最后一个 tab
          if (this.redirect) {
            this.$router.push({
              path: this.redirect.path,
              query: this.redirect.query,
              params: this.redirect.params
            })
          }
        }
      }
    }
  },
  created () {
    this.routeChange()
  }
}
</script>

<style lang="css" scoped>
  .tabItem {
    float: left;
    line-height: 30px;
    padding: 0 10px;
    cursor: pointer;
  }

  .active {
    color: #409EFF;
    border-bottom: 1px solid #409EFF;
  }
</style>
