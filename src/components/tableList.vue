<template lang="html">
  <div class="tableContent">
    <el-table @selection-change="selectChange" @select-all="selectAll" @select="selectRow" :data="tableData" ref="multipleTable"
      slot="empty" stripe :cell-style="setStyle">
      <el-table-column type="selection" width="55" v-if="multipleShow"></el-table-column>
      <el-table-column fixed="left" type="index" align="center" label="序号"></el-table-column>
      <el-table-column :width="title.width" align="center" :show-overflow-tooltip="true" v-for="(title, index) in titles"
        :key="`${title.label}_${index}`" :label="title.label" :prop="title.prop">
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" :width="operateWidth" v-if="btns && btns.length > 0">
        <template slot-scope="scope">
          <el-button v-for="(btn, i) in btns" :key="`${btn.text}_${scope.$index}_${i}`" v-if="!scope.row.hiddenBtns || !scope.row.hiddenBtns.includes(i)"
            :type="btn.type" size="mini" @click="handleClick(btn.fun, scope.$index, scope.row)">{{btn.text}}</el-button>
        </template>
      </el-table-column>
      <div class="emptyStyle" slot="empty">
        <div class="emptyIcon"></div>
        <div class="emptyText mt10px mb20px">无法查找到数据</div>
      </div>
    </el-table>
  </div>
</template>

<script>
/*
  组件使用说明：
      1、titles 参数说明：label（表格列名称），prop（表格列填充值参数），width（列的宽度）
      2、tableData 特定参数说明：style（该参数为 object 类型，可自定义设置该列样式）
         例：style: { pass: 'red'}，'pass' 表示 tableData 数组中，数组元素中的 'pass' 字段的自定义
         样式为 'red'，如果当前组件 tableList 中的 allClass（预设样式）中没有 'red' 样式，则需要添加
         'red' 样式后，方能起效；
         hiddenBtns：传入该数据，可指定当前行隐藏第几个按钮，例：hiddenBtns = [0, 2]，可隐藏 "btns" 中的 第 1，3个按钮
      3、btns 参数说明（表格组件具备的按钮）：text（按钮文字），fun（该按钮所调用的函数），type（按钮的类型，具体参考 elememtUi 的说明）
         特别强调：在使用该组件时，有 btns 值时，必须设定 handleClick() 函数，具体如下：
         <tableList :tableData="tableData" :titles="titles" :btns="btns" @handleClick="handleClick"></tableList>；
         在使用 <tableList></tableList> 的页面中，添加函数
         handleClick(fun, index, data) {
           this[fun](index, data);
         },
         btns 中 fun 参数定义的函数，需要在调用 tableList 组件的 methods 中定义好
      4、multipleShow 参数说明：是否显示多选框
      5、operateWidth 参数说明：操作列的宽度
      6、getSelect 函数说明：获取当前选中的行
      7、img参数说明：是否显示轮播图
*/
export default {
  name: 'tableList',
  props: ['tableData', 'titles', 'btns', 'multipleShow', 'operateWidth', 'img'],
  data () {
    return {
      allClass: {
        green: 'color:#67C23A',
        red: 'color:red',
        warning: 'color:#E6A23C',
        brand: 'color:#409EFF'
      },
      srcList: []
    }
  },
  methods: {
    handleClick (fun, index, data) {
      this.$emit('handleClick', fun, index, data)
    },
    selectRow (selection, row) {
      // 勾选某一行
      this.$emit('selectRow', selection, row)
    },
    selectAll (selection) {
      // 全选
      this.$emit('selectAll', selection)
    },
    setStyle ({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      // 设置列表的样式
      if (row.style) {
        /*
            给单元个添加特定的样式：
              1、找到当前列对应的标题填充字段
              2、从当前行 row.style 中找到当前列对应字段的样式
              3、设置当前列的样式
          */
        let currentLabelKey // 填充当前列的字段 prop
        for (let i = 0; this.titles && i < this.titles.length; i++) {
          if (this.titles[i].label === column.label) {
            currentLabelKey = this.titles[i].prop
            break
          }
        }
        const styleKey = row.style[currentLabelKey] // 当前列样式的 key 值
        return this.allClass[styleKey]
      }
    },
    selectChange (selection) {
      this.selection = selection
      this.$emit('selectChange', selection)
    },
    getSelect (selection) {
      // selection 所有选中的行
      this.$emit('getSelect', this.selection)
      return this.selection
    },
    toggleSelection (rows, selected) {
      // 切换多选框选中状态
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, selected)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    }
  },
  created () {

  }
}
</script>

<style lang="css" scoped>
  .tableContent {
    border: 1px solid #EBEEF5;
    border-top: none;
    border-bottom: none;
    box-sizing: border-box;
    position: relative;
  }

  .emptyIcon {
    width: 100px;
    margin: 0 auto;
    margin-top: 80px;
    height: auto;
    /* content: url(../assets/images/file.png); */
  }

  .emptyStyle {
    line-height: normal;
    margin-bottom: 50px;
  }

  .fz60px {
    font-size: 60px;
  }

  .page img {
    width: 100%;
  }
</style>
