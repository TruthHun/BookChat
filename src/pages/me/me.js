const util = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
  },
  onLoad: function () {
    let token = util.getToken()
    if (!token) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})
