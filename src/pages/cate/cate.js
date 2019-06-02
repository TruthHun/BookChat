const api = require('../../utils/api.js');

const app = getApp()

Page({
  data: {
  },
  onLoad: function () {
    wx.showLoading({
      title: '玩命加载中...',
    })

    api.getCategories(function(res){
      console.log(res);
    })
    
    wx.hideLoading()
  }
})
