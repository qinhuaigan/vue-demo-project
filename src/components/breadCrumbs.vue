<template lang="html">
  <div class="breadCrumbsContent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="(item, index) in breadData" :key="`${item.path}_${index}`" :to="{ path: `${item.path || ''}` }">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'breadCrumbs',
  components: {

  },
  data () {
    return {
      breadData: []
    }
  },
  watch: {
    '$route': 'routeChange'
  },
  methods: {
    routeChange () {
      this.breadData = this.globalData.breadCrumbsConfig[this.$route.path] || []
    }
  },
  created () {
    this.routeChange()
  }
}
</script>

<style lang="css" scoped>
  .breadCrumbsContent {
    border-bottom: 1px solid #C5C5C5;
    padding-bottom: 10px;
  }
</style>
