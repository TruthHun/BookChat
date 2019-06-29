// pages/notfound/notfound.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '没找到对象',
    })
  },
  goHome:function(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})