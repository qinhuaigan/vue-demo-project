<template>
  <div id="scrollNav">
    <ul class="navList">
      <li class="navItem" v-for="(item, index) in list" :class="{active: isActive === index}" @click="goTo(item, index)" :key="index"></li>
      <div class="labelBox" :style="{top: `${isActive * 30}px`}">
        <div class="labelText overHide">{{getText()}}</div>
        <div class="item_triangle"></div>
      </div>
    </ul>
  </div>
</template>

<script>
/*
  参数说明：
    list: [{
      name: '轮播图' // 标签名称
      id: '#div' // 标签对应的 div 的 id 属性
    }]
*/
import $ from 'jquery'
export default {
  name: 'scrollNav',
  components: {

  },
  props: ['list'],
  data () {
    return {
      isActive: 0 // 当前激活的 tab
    }
  },
  methods: {
    getText() {
      let txt = ''
      for (let i = 0; this.list && i < this.list.length; i++) {
        if (i === this.isActive) {
          txt = this.list[i].name
          break
        }
      }
      return txt
    },
    goTo(item, index) {
      const offdetTop = $(item.id).offset().top
      $('body,html').animate({
        scrollTop: offdetTop - 100
      }, 500, () => {
        this.isActive = index
      })
    }
  },
  created () {
    const that = this
    $(document).scroll(function(e) {
      const sTop = $(this).scrollTop() // 浏览器滚动条的 scrollTop 位置
      // const winH = $(window).height() // 浏览器可见区域的高度

      // 导航条各模块的位置
      const modules = []
      for (let i = 0; i < that.list.length; i++) {
        const offsetTop = $(that.list[i].id).offset().top
        modules.push({
          name: that.list[i].name,
          id: that.list[i].id,
          top: offsetTop
        })
      }
      for (var i = 0; i < modules.length; i++) {
        if (modules[i].top >= sTop && modules[i].top <= sTop + 100) {
          // 切换新的 "激活 tab"
          that.isActive = i
          break
        }
      }
    })
  },
  mounted () {

  },
  destroyed () {
    $(document).off('scroll')
  }
}
</script>

<style scoped="scoped">
  .navList {
    position: relative;
  }

  .navList .navItem {
    width:  20px;
    height: 20px;
    box-sizing: border-box;
    border: 1px solid #EB8200;
    margin-bottom: 10px;
    border-radius: 50%;
    cursor: pointer;
  }

  .navList .active {
    background-color: #EB8200;
  }

  .labelBox {
    display: inline-block;
    position: absolute;
    right: 30px;
    top: -2px;
    transition: 0.3s;
  }

  .labelBox .labelText {
    line-height: 40px;
    padding: 0 10px;
    background: #EB8200;
    color: #fff;
    font-size: 14px;
    width: 60px;
    text-align: center;
  }

  .labelBox .item_triangle {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 12px solid #EB8200;
    border-bottom: 6px solid transparent;
    position: absolute;
    right: -10px;
    top: 4px;
  }
</style>
