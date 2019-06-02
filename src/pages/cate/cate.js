const api = require('../../utils/api.js');
const config = require('../../config.js');

const app = getApp()

Page({
  data: {
    categories: {}
  },
  onLoad: function() {
    wx.showLoading({
      title: '玩命加载中...',
    })

    let that = this;

    api.getCategories(function(res) {
      if (config.debug) console.log('api.getCategories: ', res);
      that.setData({
        categories: res
      })
    })
  },
  onReady: function(){
    wx.hideLoading()
  }
})