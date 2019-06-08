const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    user: {},
    now: new Date().getFullYear(),
  },
  onLoad: function() {
    this.initUser()
  },
  onShow: function() {
    this.initUser()
  },
  onUnload:function(){
    this.initUser()
  },
  initUser: function() {
    let that = this
    let user = util.getUser()
    if (user == undefined || user.token == undefined || user.uid <= 0) {
      user = {
        'uid': 0,
        'nickname': '游客，请戳我登录',
        'avatar': '/assets/images/logo.png',
        'intro': '分享知识，共享智慧；知识，因分享，传承久远'
      }
    }
    that.setData({
      user: user,
    })
  },
  logout: function(e) {
    util.request(config.api.logout)// 只需调用，不需要处理返回结果
    util.clearUser()
    util.toastSuccess('退出成功')
    this.initUser()
  },
  userEvent: function(e) {
    if (config.debug) console.log("userEvent", e)
    if (this.data.user.uid == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
  }
})