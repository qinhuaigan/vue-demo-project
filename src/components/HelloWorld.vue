<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">
          Core Docs
        </a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">
          Forum
        </a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">
          Community Chat
        </a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul id="test">
      <li>
        <a href="http://router.vuejs.org/" target="_blank">
          vue-router
        </a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank">
          vuex
        </a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">
          vue-loader
        </a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
          awesome-vue
        </a>
      </li>
    </ul>
    <div class="w15">
      <sideMenu :bars="bars"></sideMenu>
    </div>
     <table id="table1">
       <tr>
         <td>哈哈</td>
       </tr>
     </table>
     <downLoadExcel :tablesID="['table1']" ref="downLoadExcelRefs"></downLoadExcel>
  </div>
</template>

<script>
import sideMenu from './sideMenu'
import tableList from './tableList'
import downLoadExcel from './downLoadExcel'
export default {
  name: 'HelloWorld',
  components: {
    sideMenu,
    tableList,
    downLoadExcel
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      bars: [{
        title: '导航一',
        icon: 'el-icon-location',
        path: ''
      }, {
        title: '导航二',
        icon: 'el-icon-menu',
        path: '/',
        children: [{
          title: '选项一',
          path: '',
          icon: 'el-icon-s-comment'
        }, {
          title: '选项二',
          path: '',
          icon: 'el-icon-s-claim'
        }]
      }]
    }
  },
  mounted () {
    // this.$refs.downLoadExcelRefs.download()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
