const api = require('../../utils/api.js');
const config = require('../../config.js');

const app = getApp()

Page({
  data: {
    categories: {},
    height: 0
  },
  onLoad: function() {
    wx.showLoading({
      title: '玩命加载中...',
    })

    let that = this;

    api.getCategories().then((categories)=>{
      if (config.debug) console.log('api.getCategories: ', categories);
      that.setData({
        categories: categories
      })
    }).catch((e)=>{
      console.log(e)
    })
  },
  onReady: function(){
    wx.hideLoading()
  }
})