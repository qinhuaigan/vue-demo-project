<template>
  <div id="emptyStyle">
    <div class="emptyStyle">
      <div class="emptyIcon"></div>
      <div class="emptyText mt10px mb20px">无法查找到数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'emptyStyle',
  components: {

  },
  data() {
    return {

    }
  },
  methods: {

  },
  created() {

  },
  mounted() {

  },
  destroyed() {

  }
}
</script>

<style scoped="scoped">
  .emptyIcon {
    width: 100px;
    margin: 0 auto;
    /* margin-top: 200px; */
    height: auto;
    content: url(../assets/img/file.png);
  }

  .emptyStyle {
    text-align: center;
    color: #ccc;
    line-height: normal;
    padding: 102px 0;
  }
</style>
