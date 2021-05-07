<template>
  <div id="cropperImage">
    <!-- 选择文件 input 框 -->
    <input id="cropperFileInput" @change="onChange" accept=".jpg,.png,.jpeg,.bmp,.gif" hidden type="file" />
    <el-dialog :close-on-click-modal="false" :destroy-on-close="true" title="图片裁剪" :visible.sync="dialogVisible" width="600px">
      <div class="warnColor fz14px">注：只支持jpg、png、jpeg、bmp、gif 文件</div>
      <div class="mt10px mb10px">
        <el-button size="mini" @click="selectFile()">选择文件</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="cropperContent" v-loading="loading">
            <vueCropper @realTime="realTime" ref="cropper" @imgLoad="imgLoad" :fixed="true" :img="fileUrl" :centerBox="true" :canMove="false" autoCropWidth="200px" autoCropHeight="200px" :autoCrop="true" outputType="jpg"></vueCropper>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="">效果预览：</div>
          <div :style="previewStyle">
            <div :style="previews.div">
              <img :src="previews.url" :style="previews.img">
            </div>
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirm()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import $ from 'jquery'
import {
  VueCropper
} from 'vue-cropper'
export default {
  name: 'cropperImage',
  components: {
    VueCropper
  },
  props: [],
  data() {
    return {
      dialogVisible: false,
      fileUrl: null,
      file: null,
      loading: false,
      previewStyle: null,
      previews: {}
    }
  },
  methods: {
    selectFile() {
      $('#cropperFileInput').click()
    },
    onChange(e) { // 切换图片
      const file = e.target.files[0]
      this.loading = true
      this.fileUrl = this.previewURL(file)
      this.file = file
      $('#cropperFileInput').val('')
    },
    realTime(data) {
      const previews = data
      const h = 0.5
      this.previewStyle = {
        width: previews.w + 'px',
        height: previews.h + 'px',
        overflow: 'hidden',
        margin: '10px 0 0 0',
        zoom: h
      }
      this.previews = data
    },
    previewURL(file) {
      return URL.createObjectURL(file)
    },
    imgLoad(success, error) {
      this.loading = false
    },
    open(file) { // 打开图片裁剪窗口
      this.loading = true
      this.fileUrl = this.previewURL(file)
      this.file = file
      this.dialogVisible = true
    },
    confirm() { // 确定裁剪
      this.$refs.cropper.getCropBlob((data) => {
        // do something
        this.dialogVisible = false
        // 将 blob 对象转成 file 对象
        let file = new window.File([data], this.file.name, {
          type: data.type
        })
        this.$emit('confirm', file)
      })
    }
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
  .cropperContent {
    width: 100%x;
    height: 300px;
    background: #e5e5e5;
  }
</style>
