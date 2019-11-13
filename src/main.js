// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery' // 哪个模块需要使用Jquery，就在哪个模块单独引入即可
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/style.css'
import globalData from '../utils/globalData.js'

globalData.token = localStorage.getItem('token')
const axios = require('axios')
const Message = ElementUI.Message

axios.defaults.baseURL = 'http://192.168.2.112/v1/portal' // 本地环境
Vue.prototype.baseURL = 'http://192.168.2.112/v1/portal' // 本地环境
Vue.prototype.fileBaseURL = 'http://192.168.2.112/data/access/' // 文件前缀地址（本地环境）

Vue.prototype.globalData = globalData
Vue.prototype.$axios = axios
Vue.prototype.$querystring = require('querystring')
Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.prototype.Loading = null
Vue.prototype.showLoading = function (text) {
  this.Loading = this.$loading({
    // lock: true,
    text: `${text || '请稍后'}...`,
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

Vue.prototype.hideLoading = function () {
  this.Loading.close()
}

// 下载文件
Vue.prototype.downloadFile = function (url) {
  $('#downloadFile').remove()
  var $form = $(`<form id='downloadFile' action=${url} method='GET'></form>`)
  $form.appendTo($('body'))
  $form.submit()
}

Vue.prototype.checkPermissionExist = function (id) {
  // 为了避免 "获取权限请求" 延时，导致按钮显示不出来的问题，添加 Promise() 来处理
  // 验证某权限是否存在，id 是要验证的权限的 id
  const userPermission = localStorage.getItem('authorityList')
  if (userPermission) {
    this.globalData.userPermission = userPermission.split(',')
    this.globalData.userPermission = this.globalData.userPermission.reduce((total, item) => {
      total.push(parseFloat(item))
      return total
    }, [])
  }
  if (this.globalData.userPermission && this.globalData.userPermission.includes(id)) {
    return true
  } else {
    return false
  }
}

// 上传文件，files 为源文件数组，例：files = [file1, file2]
Vue.prototype.uploadFile = async function (files) {
  if (!files || files.length === 0) {
    return []
  }
  const promiseArr = []
  for (let i = 0; i < files.length; i++) {
    promiseArr.push(
      new Promise((resolve) => {
        const form = new FormData()
        form.append('file', files[i])
        axios({
          method: 'post',
          url: `/file/upload?token=${this.globalData.token}`,
          data: form
        }).then((response) => {
          if (response.data.code === 0) {
            resolve(response.data.data.fileUrl)
          } else {
            resolve(false)
          }
        }).catch(() => {
          resolve(false)
        })
      })
    )
  }
  this.showLoading()
  let result = await Promise.all(promiseArr)
  result = result.filter((item) => {
    return item
  })
  this.hideLoading()
  return result
}

// 将 json 数据转成 formData
Vue.prototype.formatFormData = function (data) {
  const form = new FormData()
  if (data) {
    for (let key in data) {
      if (data[key] !== undefined || data[key] !== null) {
        form.append(key, data[key])
      }
    }
  }
  return form
}

// 获取权限之前，需要清除缓存的权限信息
localStorage.removeItem('authorityList')
// 获取登录用户所拥有的权限
Vue.prototype.getGlobalUserPermission = function () {
  const userPermission = localStorage.getItem('authorityList')
  if (userPermission) {
    this.globalData.userPermission = userPermission.split(',')
    this.globalData.userPermission = this.globalData.userPermission.reduce((total, item) => {
      total.push(parseFloat(item))
      return total
    }, [])
  }
  if (this.globalData.userPermission) {
    return this.globalData.userPermission
  }
  if (!this.globalData.token) {
    return []
  }
  return new Promise((resolve) => {
    axios({
      method: 'get',
      url: `/account/getMenuIdsByUserNo?token=${this.globalData.token}`
    }).then((response) => {
      if (response.data.code === 0) {
        this.globalData.userPermission = response.data.data
        // 添加一个默认所有人都拥有的权限 2（医务科管理），为了给没有权限的账号，在前端首页能显示 "医务科管理" 菜单栏
        this.globalData.userPermission.push(2)
        localStorage.setItem('authorityList', this.globalData.userPermission)
        resolve(this.globalData.userPermission)
      } else {
        Message({
          type: 'error',
          message: `${response.data.extMsg || response.data.msg}`
        })
        resolve([])
      }
    }).catch(() => {
      resolve([])
    })
  })
}

Vue.prototype.formatDate = function (value, type) {
  // 日期格式过滤器
  if (!value) {
    return null
  }
  const date = new Date(value)
  let fmt = type || 'yyyy-MM-dd HH:mm:ss'
  var obj = {
    'y': date.getFullYear(), // 年份，注意必须用getFullYear
    'M': date.getMonth() + 1, // 月份，注意是从0-11
    'd': date.getDate(), // 日期
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'w': date.getDay(), // 星期，注意是0-6
    'H': date.getHours(), // 24小时制
    'h': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 12小时制
    'm': date.getMinutes(), // 分钟
    's': date.getSeconds(), // 秒
    'S': date.getMilliseconds() // 毫秒
  }
  var week = ['天', '一', '二', '三', '四', '五', '六']
  for (var i in obj) {
    fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
      var val = obj[i] + ''
      if (i === 'w') return (m.length > 2 ? '星期' : '周') + week[val]
      for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val
      return m.length === 1 ? val : val.substring(val.length - m.length)
    })
  }
  return fmt
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
