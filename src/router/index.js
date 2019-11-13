import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import {
//   Message
// } from 'element-ui'
// import check from '../../utils/check.js'
// const axios = require('axios')
const Route = Router
Vue.use(Router)

// function getGlobalUserPermission () {
//   return new Promise((resolve) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       axios({
//         method: 'get',
//         url: `/account/getMenuIdsByUserNo?token=${token}`
//       }).then((response) => {
//         if (response.data.code === 0) {
//           const result = response.data.data || []
//           result.push(2)
//           // 添加一个默认所有人都拥有的权限 2（医务科管理），为了给没有权限的账号，在前端首页能显示 "医务科管理" 菜单栏
//           localStorage.setItem('authorityList', result)
//           resolve(result)
//         } else {
//           Message({
//             type: 'error',
//             message: `${response.data.extMsg || response.data.msg}`
//           })
//           resolve([])
//         }
//       }).catch(() => {
//         resolve([])
//       })
//     } else {
//       resolve([])
//     }
//   })
// }

const router = new Route({
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  }]
})

// router.beforeEach(async (to, from, next) => {
//   if (to.path === '/Login_F2_2') {
//     next()
//     return
//   }
//   const authorityList = localStorage.getItem('authorityList')
//   if (!authorityList) {
//     await getGlobalUserPermission()
//   }
//   /* 检测是否拥有访问当前页面的权限 */
//   const checkResult = await check.checkRouter(to)
//   // 暂时不用验证，设置权限后，在验证
//   if (checkResult) {
//     next()
//   } else {
//     Message({
//       type: 'error',
//       message: '对不起，您暂无权限访问当前页面'
//     })
//   }
// })

export default router
