const config = require('../../config.js')
Page({
  data: {
    bindNew: false,
    loading: false,
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '绑定账号',
    })
  },
  changeTab: function(e) {
    if (config.debug) console.log("changeTab", e)
    e.currentTarget.dataset.bind == "old" ? this.setData({
      bindNew: false
    }) : this.setData({
      bindNew: true
    })
  }
})