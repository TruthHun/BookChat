Page({
  data: {
    title: '没找到对象'
  },
  goHome: function(e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})