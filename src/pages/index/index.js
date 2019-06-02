// index.js
// 获取应用实例
const app = getApp()
const config = require('../../config.js')
const api = require('../../utils/api.js')

Page({
  data: {
    userInfo: {},
    banners: {},
    hideBanner: 'hidden', // 默认隐藏横幅，如果横幅存在，则把该值置空
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function() {
    wx.showLoading({
      title: '玩命加载中...',
    })

    let that = this;

    api.getBanners(function(res) {
      if (config.debug) console.log('api.getBanners:', res);
      if (res.data.data.banners && res.data.data.banners.length > 0) {
        that.setData({
          banners: res.data.data.banners,
          hideBanner: ''
        })
      }
    })

    api.getCategories(function(res) {
      if (config.debug) console.log('api.getCategories:', res);
    })

    // 获取最新推荐
    api.getBooks(1, 10, "latest-recommend", 0, function(res) {
      if (config.debug) console.log("api.getBooks,recommenBooks:", res)
      that.setData({
        "recommendBooks": res
      })
    })
  },
  onReady: function(){
    wx.hideLoading()
  }
})