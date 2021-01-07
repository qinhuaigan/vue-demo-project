<template>
  <div id="consultinDialog" v-if="userInfo">
    <!-- 选择文件 input 框 -->
    <input id="fileUpload" @change="onChange" hidden type="file" />
    <div class="consultinBody">
      <div class="consultinDialog">
        <div class="dialogLeft clearfix">
          <div class="dialogLeftHead clearfix">
            <div class="fl">
              <el-avatar shape="square" :size="80" :src="defaultAvatar"></el-avatar>
            </div>
            <div class="headTitle">{{userInfo.userName}}</div>
          </div>
          <ul class="shopList" :style="{height: `${dialogHeight - dislogHeadHeight}px`}">
            <el-badge :value="receiveMsg[item.aid].msgCount" class="badgeStyle" v-for="item in talkerList" :key="item.key"
              v-if="item.aid !== userInfo.aid" :max="99" :hidden="receiveMsg[item.aid].msgCount <= 0">
              <li class="shopItem" @click="changeTalker(item)" :class="{active: item.aid === currentTalker}">
                <el-avatar shape="square" style="vertical-align: middle;" :size="20" :src="defaultAvatar"></el-avatar>
                <!-- <i class="el-icon-s-custom fz20px"></i> -->
                <span class="fz14px">{{hideUserName && hideUserName[item.aid] ? '**********' : item.username}}</span>
              </li>
            </el-badge>
          </ul>
        </div>
        <div class="dialogCenter">
          <div class="dialogCenterHead clearfix">
            <div class="fl">
              <el-avatar shape="square" :size="80" :src="defaultAvatar"></el-avatar>
            </div>
            <div class="headTitle">{{shopName}}</div>
          </div>
          <div id="dialogCenterContent" class="dialogCenterContent" ref="dialogCenterContent">
            <el-divider content-position="center" v-if="currentPage >= totalPage">没有更多了...</el-divider>
            <ul class="messageList" v-if="receiveMsg[currentTalker]">
              <li class="messageItem mb10px" :index="index" v-for="(item, index) in messageList" :key="index">
                <div class="messageItemBox_other clearfix">
                  <div class="clearfix">
                    <div class="userIco clearfix" :class="{successColor: currentTalker !== item.aid, fl: currentTalker === item.aid, fr: currentTalker !== item.aid}">
                      <div class="ml10px mr10px" :class="{successColor: currentTalker !== item.aid, fl: currentTalker === item.aid, fr: currentTalker !== item.aid}">
                        <el-avatar shape="square" style="vertical-align: middle;" :size="20" :src="defaultAvatar"></el-avatar>
                      </div>
                      <div class="userName" :class="{successColor: currentTalker !== item.aid, fl: currentTalker === item.aid, fr: currentTalker !== item.aid}">{{item.username}}</div>
                      <!-- <i class="el-icon-s-custom fz20px"></i> -->
                      <span></span>
                    </div>
                  </div>
                  <div class="clearfix">
                    <div class="userMsg ml10px mr10px" :class="{fl: currentTalker === item.aid, fr: currentTalker !== item.aid}">
                      <div v-if="item.msgType === 1">{{item.content}}</div>
                      <el-image v-if="item.msgType === 2" style="width: 100px; height: 100px" :preview-src-list="[`${fileBaseURL}${item.content}`]"
                        :src="`${fileBaseURL}${item.content}`" fit="cover"></el-image>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="dialogCenterSend">
            <textarea class="sendTextArea" placeholder="请输入内容..." v-model="sendText" v-focus="true"></textarea>
            <div class="sendBtnBox">
              <el-button type="primary" size="mini" :disabled="!currentTalker" @click="send()">发送</el-button>
            </div>
            <ul class="operatorList clearfix">
              <li class="operatorItem" @click="selectFile()">
                <i class="el-icon-picture"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="dialogRight">
          <div class="tabs">
            <ul class="tabsList">
              <li class="tabsItem" @click="tabChange(index)" :class="{active: index === activeName}" v-for="(item, index) in tabsData"
                :key="index">{{item}}</li>
            </ul>
          </div>
          <!-- 商品信息 -->
          <div class="dialogRightContent" v-if="activeName === 0 && goodInfo" :style="{height: `${dialogHeight - 40}px`}">
            <!-- 原材料商品信息 -->
            <el-row :gutter="10">
              <el-col :span="8">
                <el-image class="goodImg" fit="cover" :src="`${fileBaseURL}${goodInfo.imgList ? goodInfo.imgList[0] : ''}`">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </el-col>
              <el-col :span="16">
                <div class="goodName">{{goodInfo.typeName}}--{{goodInfo.weight}}{{goodInfo.weightUnit}}/{{goodInfo.countUnit}}</div>
              </el-col>
            </el-row>
            <div class="mt5px fz12px">咨询费用：{{goodInfo.advisory ? `￥${goodInfo.advisory.toFixed(2)}` : '免费'}}</div>
            <div class="mt5px fz12px">当前报价：￥{{goodInfo.money.toFixed(2)}}</div>
            <div class="mt5px fz12px">剩余库存：{{goodInfo.store}}{{goodInfo.countUnit}}</div>
          </div>
          <!-- 我的订单 -->
          <div class="dialogRightContent" v-loading="loading" v-if="activeName === 1" :style="{height: `${dialogHeight - 40}px`}">
            <ul class="orderList">
              <li class="orderItem" v-for="item in orderList" :key="item.id">
                <el-row :gutter="10">
                  <el-col :span="19">
                    <div class="fz12px">订单号：{{item.orderId}}</div>
                    <div class="order_good_name">{{item.tails.goodsName}}</div>
                    <div class="fz12px warnColor">￥{{item.tails.price.toFixed(2)}}</div>
                  </el-col>
                  <el-col :span="5">
                    <div class="fz12px" :class="[payStatusColorMap[item.payStatus]]">{{payStatusMap[item.payStatus]}}</div>
                    <div class="order_good_num">x{{item.num}}</div>
                    <router-link class="fz12px" :to="{path: '/rawMaterial/rawMaterialOrderDetail', query: {id: item.id}}">明细</router-link>
                  </el-col>
                </el-row>
              </li>
            </ul>
            <el-divider content-position="center" v-if="orderCurrnetPage >= orderTotalPage">
              <span style="color: #eee;">到底了...</span>
            </el-divider>
          </div>
          <!-- 店铺信息 -->
          <div class="dialogRightContent" v-if="activeName === 2" :style="{height: `${dialogHeight - 40}px`}">
            <div class="fz12px">店铺名称：{{shopName}}</div>
            <div class="fz12px mt5px">联系电话：{{shopInfo.phone}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="closeBtn" @click="showChat = false">
        <i class="el-icon-circle-close"></i>
      </div> -->
    </div>
  </div>
</template>

<script>
/*
    参数说明：
    shopName：店铺名称
    startTalker：打开弹框时聊天对象 aid
    showNotify：是否显示上线通知
    hideUserName：隐藏用户姓名对象（例：{10000: true}）
    shopId: 店铺 id
    talkerAid: 客服 aid
    isCustomer：当前登录用户是否充当 "客户" 角色
  */
import $ from 'jquery'
export default {
  name: 'consultinDialog',
  components: {

  },
  props: ['shopName', 'startTalker', 'showNotify', 'hideUserName', 'shopId', 'talkerAid', 'isCustomer'],
  watch: {
    startTalker(val) {
      this.currentTalker = val
    }
  },
  data() {
    return {
      loading: false,
      payStatusMap: {
        '-1': '未付款',
        '0': '付款中',
        '1': '已付款'
      },
      payStatusColorMap: {
        '-1': 'failColor',
        '0': 'warningColor',
        '1': 'successColor'
      },
      orderList: [],
      dialogHeight: 0,
      dislogHeadHeight: 0,
      tabsData: ['正在咨询', '我的订单', '店铺信息'],
      shopInfo: null, // 店铺信息
      activeName: 0,
      currentTalker: null, // 当前聊天对象 aid
      receiveMsg: {}, // 接收消息队列
      showChat: true,
      defaultAvatar: require('../assets/img/defaultAvatar.jpg'),
      talkerList: [], // 聊天对象列表
      webSocket: null,
      sendText: null,
      userInfo: this.$store.state.userInfo, // 当前用户信息
      messageList: [], // 当前聊天窗口的消息列表
      onlineUsers: [],
      currentPage: 1, // 历史消息当前页
      pageSize: 10, // 每页条数
      totalPage: 0, // 总页数
      goodInfo: null, // 商品信息
      goodId: null, // 商品 id
      orderCurrnetPage: 1, // 订单列表当前页
      orderTotalPage: 0 // 订单
    }
  },
  methods: {
    rightScroll() { // 右侧滚动监听
      this.$nextTick(() => {
        const that = this
        $('.dialogRightContent').scroll(function() {
          const top = $(this).scrollTop()
          const totalHeight = $(this)[0].scrollHeight
          const viewHeight = $(this).outerHeight()
          if (top + viewHeight >= (totalHeight - 5)) {
            if (that.orderCurrnetPage < that.orderTotalPage) {
              that.orderCurrnetPage += 1
              that.getMyOrders()
            }
          }
        })
      })
    },
    getMyOrders() { // 获取我的订单
      const data = {
        token: this.globalData.token,
        pageNum: this.orderCurrnetPage,
        pageSize: this.pageSize
      }
      this.loading = true
      this.$axios({
        method: 'get',
        url: `/trade/order/queryByRawPage?${this.$querystring.stringify(data)}`
      }).then((response) => {
        if (response.data.code === 0) {
          this.orderTotalPage = response.data.data.totalPage
          const result = response.data.data.list
          result.forEach((item) => {
            item.tails.imgs = item.tails.imgs ? JSON.parse(item.tails.imgs) : []
          })
          this.orderList = [...this.orderList, ...result]
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getGoodInfo() { // 获取商品信息
      if (!this.goodId || (this.goodInfo && this.goodInfo.id === parseFloat(this.goodId))) {
        return
      }
      const data = {
        token: this.globalData.token,
        id: this.goodId
      }
      this.$axios({
        method: 'get',
        url: `/trade/goodsRaw/getById?${this.$querystring.stringify(data)}`
      }).then((response) => {
        if (response.data.code === 0) {
          this.goodInfo = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      }).catch(() => {})
    },
    tabChange(index) { // 切换tab
      if (this.activeName === index) {
        return
      }
      this.activeName = index
      if (this.activeName === 1 && this.isCustomer) {
        // 我的订单
        this.orderCurrnetPage = 1
        if (this.isCustomer) {
          this.orderList = []
          this.getMyOrders()
        }
        this.rightScroll()
      }
    },
    getShopInfo() { // 获取店铺信息
      const data = {
        token: this.globalData.token,
        id: this.shopId
      }
      this.$axios({
        method: 'get',
        url: `/trade/shop/queryOne?${this.$querystring.stringify(data)}`
      }).then((response) => {
        if (response.data.code === 0) {
          this.shopInfo = response.data.data
        } else {
          this.$message({
            type: 'error',
            message: response.data.msg
          })
        }
      }).catch(() => {})
    },
    getHistoryMsg() { // 获取历史消息
      // 聊天人 aid，店铺 id
      return new Promise((resolve) => {
        const data = {
          token: this.globalData.token,
          accountAid: this.isCustomer ? this.userInfo.aid : this.currentTalker,
          shopId: this.shopId,
          pageNum: this.currentPage,
          pageSize: this.pageSize
        }
        this.$axios({
          method: 'get',
          url: `/trade/message/queryChatRecord?${this.$querystring.stringify(data)}`
        }).then((response) => {
          if (response.data.code === 0) {
            this.totalPage = response.data.data.totalPage
            let msgList = response.data.data.list
            msgList = msgList.reverse()
            msgList.forEach((item) => {
              item.createTalker = parseFloat(item.createTalker)
              item.aid = item.createTalker
              item.username = item.createTalkerName
              item.msgType = parseFloat(item.msgType)
            })
            resolve(msgList)
          } else {
            this.$message({
              type: 'error',
              message: response.data.msg
            })
            resolve([])
          }
        }).catch(() => {
          resolve([])
        })
      })
    },
    selectFile(fileType) { // 打开选择文件框
      $('#fileUpload').attr('accept', fileType || '.png,.jpg')
      $('#fileUpload').click()
    },
    async onChange(e) { // 选择文件回调
      const file = e.target.files[0]
      if (file) { // 选择了文件，开始上传
        const result = await this.uploadFile([file], true)
        $('#fileUpload').val('')
        this.send(result[0])
      }
    },
    async changeTalker(talker) { // 切换聊天对象
      if (this.currentTalker === talker.aid) {
        return
      }
      this.currentTalker = talker.aid
      const msgList = await this.getHistoryMsg()
      console.log(msgList)
      this.messageList = msgList
      this.receiveMsg[talker.aid].msgCount = 0
      this.setDialogCenterContentPosition()
      this.updateMsgCountData()
    },
    async setDefaultTaklk(data) { // 设置默认联系人列表
      // 去重
      data = data.filter((item) => {
        return !this.receiveMsg[item.aid]
      })
      this.talkerList = [...this.talkerList, ...data]
      for (let i = 0; i < this.talkerList.length; i++) {
        this.receiveMsg[this.talkerList[i].aid] = this.receiveMsg[this.talkerList[i].aid] || {
          aid: this.talkerList[i].aid, // 消息发送者 aid
          username: this.talkerList[i].username, // 消息发送者用户名（昵称）
          msg: [] // 消息列表
        }
      }
      // 获取历史消息
      const msgList = await this.getHistoryMsg()
      this.receiveMsg[this.currentTalker].msg = msgList
      this.messageList = msgList
      this.setDialogCenterContentPosition()
    },
    openDialog() {
      if (!this.userInfo) {
        this.$message({
          type: 'warning',
          message: '请先登录'
        })
        return
      }
      this.showChat = true
      // 获取当前连天对象的消息列表数据
      // if (!this.receiveMsg[this.currentTalker]) {
      //   // 联系人列表没有当前聊天对象，添加
      //   this.talkerList.push({
      //     aid: data['account_aid'],
      //     username: data.username
      //   })
      // }
      for (let key in this.receiveMsg) {
        if (parseFloat(key) === this.currentTalker) {
          this.messageList = this.receiveMsg[key].msg
          // 重置未读消息条数
          this.receiveMsg[key].msgCount = 0
          this.updateMsgCountData()
        }
      }
    },
    updateMsgCountData() {
      const msgCountData = []
      for (let key in this.receiveMsg) {
        msgCountData.push({
          aid: this.receiveMsg[key].aid,
          msgCount: this.receiveMsg[key].msgCount || 0
        })
      }
      this.$emit('msgCountChange', msgCountData)
    },
    initWebSocket() { // 初始化 WebSocket
      if (!this.userInfo) {
        this.$message({
          type: 'warning',
          message: '请先登录'
        })
        return
      }
      this.webSocket = new WebSocket(`wss:${this.webSocketURL}/ws/websocket/${this.$store.state.userInfo.aid}`)
      // this.webSocket = new WebSocket(`ws:192.168.1.123:8974/websocket/${this.$store.state.userInfo.aid}`)
      this.webSocket.onopen = function() {
        console.log('已经连通了websocket')
      }
      this.webSocket.onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        console.log('接收消息', data)

        // 用户上下线变化
        if (data.messageType === 3 || data.messageType === 2) { // 获取到当前在线用户
          // 在线用户发生变化，发出通知
          this.onlineUsers = data.onlineUsers || []
        } else if (data.messageType === 1) {
          // 1：有用户上线；2：有用户下线；3：获取当前在线用户
          this.$emit('userOnline', {
            aid: data.aid,
            username: data.username
          })
          this.onlineUsers.push(data.aid)
          if (this.showNotify && this.receiveMsg[data.aid]) {
            this.$notify({
              title: '上线通知',
              message: `${data.username}上线了`,
              position: 'bottom-right',
              duration: 3000
            })
          }
        }
        // 发出通知
        this.$emit('onlineUsersChange', this.onlineUsers)

        if (data['to'] === this.userInfo.aid) {
          // 该消息是发送给当前用户的，接收
          if (!this.receiveMsg[data['account_aid']] && data['account_aid'] !== this.userInfo.aid) { // 新的客户来咨询，发出通知
            this.talkerList.push({
              aid: data['account_aid'],
              username: data.username
            })
            this.$emit('talkerChange', {
              aid: data['account_aid'],
              username: data.username
            })
          }

          // 更新聊天列表 receiveMsg 的值
          this.receiveMsg[data['account_aid']] = this.receiveMsg[data['account_aid']] || {
            aid: data['account_aid'], // 消息发送者 aid
            username: data.username, // 消息发送者用户名（昵称）
            msg: [] // 消息列表
          }

          this.receiveMsg[data['account_aid']].goodId = data['goods_id']
          // 获取咨询的 "商品信息"
          this.goodId = this.receiveMsg[data['account_aid']].goodId
          this.getGoodInfo()

          // 更新当天聊天消息框数据
          if (this.currentTalker === data['account_aid']) {
            // 收到当前聊天对象发来的消息，更新聊天消息列表
            this.messageList.push({
              aid: data['account_aid'],
              username: data.username,
              msgType: data['msg_type'],
              content: data.content
            })
          }

          // 判断当前用户是否打开聊天窗口
          if (this.showChat) {
            if (this.currentTalker !== data['account_aid']) {
              this.receiveMsg[data['account_aid']].msgCount = this.receiveMsg[data['account_aid']].msgCount || 0 // 未读消息数量
              this.receiveMsg[data['account_aid']].msgCount += 1
            }
          } else {
            // 未处于聊天状态
            this.receiveMsg[data['account_aid']].msgCount = this.receiveMsg[data['account_aid']].msgCount || 0 // 未读消息数量
            this.receiveMsg[data['account_aid']].msgCount += 1
          }
          this.updateMsgCountData()
          this.setDialogCenterContentPosition()
          this.$forceUpdate()
        }
      }
      this.webSocket.onclose = () => {
        console.log('聊天已经关闭')
      }
    },
    setDialogCenterContentPosition() { // 设置聊天框滚动条位置
      this.$nextTick(() => {
        const h = this.$refs.dialogCenterContent.scrollHeight
        this.$refs.dialogCenterContent.scrollTop = h
      })
    },
    send(sendText) { // 发送消息
      const data = {
        'content': sendText || this.sendText, // 消息内容
        'username': this.userInfo.userName, // 发送人昵称
        'msg_type': sendText ? 2 : 1, // 1：文字消息；2：图片消息
        'shop_id': this.shopId, // 店铺 id
        'talker_aid': this.talkerAid, // 客服 Aid
        'account_aid': this.userInfo.aid, // 发送人 Aid
        'to': this.currentTalker, // 接收人 Aid
        'customer_aid': this.isCustomer ? this.userInfo.aid : this.currentTalker, // 客户 aid
        'goods_id': this.$route.query.goodId // 商品 id
      }
      console.log('发送的消息数据', data)
      if (!data.content) {
        this.$message({
          type: 'warning',
          message: '请输入内容'
        })
        return
      }
      this.webSocket.send(JSON.stringify(data))
      // 消息发送后，更新当前消息列表
      this.messageList.push({
        aid: data['account_aid'],
        username: data.username,
        msgType: data['msg_type'],
        content: data.content
      })
      this.$forceUpdate()
      // 清空输入框
      this.sendText = ''
      this.setDialogCenterContentPosition()
    },
    closeWebSocket() { // 关闭聊天
      this.webSocket.close()
    }
  },
  created() {
    this.goodId = this.$route.query.goodId
    this.getGoodInfo()
    this.currentTalker = this.startTalker
    this.initWebSocket()
    this.getShopInfo()
  },
  async mounted() {
    const that = this
    this.$nextTick(() => {
      this.dialogHeight = $('.dialogCenter').outerHeight()
      this.dislogHeadHeight = $('.dialogCenterHead').outerHeight()
      $('#dialogCenterContent').scroll(function() {
        const top = $(this).scrollTop()
        if (top === 0 && that.currentPage < that.totalPage) {
          that.currentPage += 1
          that.getHistoryMsg().then(function(msgList) {
            that.messageList = [...msgList, ...that.messageList]
            that.$nextTick(function() {
              const i = msgList.length - 1
              let t = 0
              // 计算滚动条应在的位置
              $('.messageList li').each(function(index) {
                if (index <= i) {
                  t += $(this).outerHeight()
                }
              })
              $('#dialogCenterContent').scrollTop(t)
            })
          })
        }
      })
    })
  },
  destroyed() {
    this.closeWebSocket()
  }
}
</script>

<style scoped="scoped">
  .consultinBody {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #ccc;
    left: 0;
    top: 0;
    z-index: 100;
    overflow: auto;
  }

  .consultinDialog {
    width: 1200px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
  }

  .consultinDialog .dialogLeft {
    float: left;
    width: 27.5%;
  }

  .consultinDialog .dialogRight {
    float: left;
    width: 27.5%;
  }

  .dialogLeftHead {
    padding: 20px;
    color: #fff;
    background-color: #00a551;
  }

  .headTitle {
    line-height: 80px;
    padding-left: 10px;
    float: left;
  }

  .consultinDialog .dialogCenter {
    float: left;
    width: 45%;
    box-sizing: border-box;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  .dialogCenter .dialogCenterHead {
    padding: 20px;
  }

  .dialogCenter .dialogCenterContent {
    height: 300px;
    background-color: #eee;
    overflow-x: hidden;
    overflow-y: auto;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    padding: 10px;
  }

  .sendTextArea {
    width: 100%;
    height: 150px;
    border: none;
    outline: none;
    resize: none;
    line-height: 25px;
    padding: 10px;
    box-sizing: border-box;
    padding-top: 0;
  }

  /*修改提示文字的颜色*/

  .sendTextArea::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #888;
    font-family: '微软雅黑';
    font-size: 12px;
  }

  .sendTextArea:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #888;
    font-family: '微软雅黑';
    font-size: 12px;
  }

  .sendTextArea::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #eee;
    font-family: '微软雅黑';
    font-size: 12px;
  }

  .sendTextArea:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #888;
    font-family: '微软雅黑';
    font-size: 12px;
  }

  .dialogLeft .shopList {
    height: 480px;
    overflow: auto;
  }

  .dialogLeft .shopList .shopItem {
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
    border-top: 1px solid #eee;
    box-sizing: border-box;
  }

  .dialogLeft .shopList .active {
    background-color: #ccf7e5;
  }

  .messageItemBox_other .userIcon {
    width: 6%;
    text-align: center;
  }

  .messageItemBox_other .userMsg {
    min-width: 20%;
    max-width: 60%;
    padding: 10px;
    font-size: 12px;
    background-color: #fff;
    margin: 10px;
    border-radius: 5px;
    margin-bottom: 0;
  }

  .dialogCenterSend {
    position: relative;
    padding-top: 30px;
  }

  .sendBtnBox {
    display: inline-block;
    position: absolute;
    right: 20px;
    bottom: 20px;
    z-index: 100;
  }

  .closeBtn {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 30px;
    right: 30px;
    font-size: 40px;
    color: #fff;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }

  .badgeStyle {
    width: 100%;
    box-sizing: border-box;
  }

  .operatorList {
    display: inline-block;
    position: absolute;
    left: 10px;
    top: 0;
  }

  .operatorList .operatorItem {
    width: 30px;
    line-height: 30px;
    float: left;
    text-align: center;
    cursor: pointer;
    font-size: 20px;
  }

  .operatorList .operatorItem i {
    vertical-align: middle;
  }

  .userName {
    font-size: 12px;
    line-height: 20px;
  }

  .tabsList {
    padding: 0 10px;
    display: flex;
  }

  .tabsList .tabsItem {
    flex: 1;
    text-align: center;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    font-size: 14px;
    cursor: pointer;
  }

  .tabsList .active {
    border-bottom: 2px solid #00a551;
    color: #00a551;
    line-height: 40px;
  }

  .dialogRightContent {
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .goodImg {
    height: 80px;
    width: 100%;
    line-height: 80px;
    font-size: 26px;
    background-color: #eee;
    text-align: center;
  }

  .goodName {
    font-size: 12px;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    word-wrap: break-word;
  }

  .orderList .orderItem {
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 10px;
  }

  .order_good_name {
    font-size: 12px;
    height: 40px;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
    color: #ccc;
  }

  .order_good_num {
    line-height: 40px;
  }
</style>
<style>
  #consultinDialog sup {
    top: 50%;
    transform: translateY(-50%);
  }

  .dialogCenter .el-divider__text {
    width: 100%;
    background-color: #eee;
    color: #ccc;
    text-align: center;
  }
</style>
