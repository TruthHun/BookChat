const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let identify = options.id || options.identify || 'docker-practice';
    this.loadData(identify)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  search: function(e) {
    console.log(e)
  },
  loadData: function(identify) {
    let that = this

    Promise.all([util.request(config.api.bookMenu, {
      identify: identify
    })]).then(function([resMenu]) {
      if(config.debug) console.log(resMenu)
      if (resMenu.data && resMenu.data.menu) {
        that.setData({
          menu: resMenu.data.menu
        })
      }
    }).catch(function(e) {

    }).finally(function() {
      wx.hideLoading()
    })
  }
})