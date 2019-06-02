const api = require('../../utils/api.js');

const app = getApp()

Page({
  data: {
    categories: {}
  },
  onLoad: function () {
    wx.showLoading({
      title: '玩命加载中...',
    })
    
    let that = this;

    api.getCategories(function(res){
      that.setData({
        categories: res
      })
    })

    wx.hideLoading()
  }
})
