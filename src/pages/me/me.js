const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    user: {
      'uid':0,
      'nickname':'游客，请戳我登录',
      'avatar': '/assets/images/logo.png',
      'intro':'分享知识，共享智慧；知识，因分享，传承久远'
    },
    now: new Date().getFullYear(),
  },
  onLoad: function() {
    let that = this
    let user = util.getUser()
    if (user != undefined && user.token != undefined && user.uid>0) {
      that.setData({
        user: user,
      })
    }
  },
  onHide: function() {
    console.log('hide')
  },
  logout: function(e) {
    // 直接调用，不需要处理结果
    util.request(config.api.logout)

    util.clearUser()
    util.toastSuccess('退出成功')
    setTimeout(function() {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 1000)
  },
  userEvent:function(e){
    if (config.debug) console.log("userEvent",e)
    if(this.data.user.uid==0){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
  }
})