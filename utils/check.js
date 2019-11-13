const axios = require('axios');
export default {
  routerAuthority: {
    // '/doctorSeniorityHome_F3-2': [4, 5, 6, 7, 8, 9],
  },
  getUserPermission() {
    // 获取当前用户所拥有的的权限
    return new Promise((resolve) => {
      const token = localStorage.getItem('token');
      if (!token) {
        resolve([]);
        return;
      }
      axios({
        method: 'get',
        url: `/account/getMenuIdsByUserNo?token=${token}`
      }).then((response) => {
        if (response.data.code == 0) {
          response.data.data = response.data.data || []
          // 添加一个默认所有人都拥有的权限 2（医务科管理），为了给没有权限的账号，在前端首页能显示 "医务科管理" 菜单栏
          response.data.data.push(2)
          resolve(response.data.data);
        } else {
          resolve(false);
        }
      }).catch((error) => {
        console.log(error);
        resolve(false);
      })
    })
  },
  // async checkRouter(router) {
  //   // 检测是否拥有跳转到当前路由的权限
  //   let authorityList = localStorage.getItem('authorityList');
  //   if (authorityList) {
  //     authorityList = authorityList.split(',');
  //     for (let i = 0; i < authorityList.length; i++) {
  //       authorityList[i] = parseFloat(authorityList[i])
  //     }
  //   } else {
  //     //  为了避免刷新浏览器时，延时，还没有获取到用户权限，导致无法跳转的问题
  //     authorityList = await this.getUserPermission();
  //   }
  //   let result = false;
  //   const needPermission = this.routerAuthority[router.path];
  //   if (!needPermission) {
  //     // 如果要跳转的页面，没有设置需要访问的权限，则默认可以访问
  //     result = true;
  //   } else {
  //     for (let i = 0; authorityList && i < authorityList.length; i++) {
  //       // 遍历当前角色所拥有的权限
  //       if (needPermission.includes(authorityList[i])) {
  //         result = true;
  //         break;
  //       }
  //     }
  //   }
  //   return result;
  // }
}
