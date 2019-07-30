const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
const config = require('../../config.js')

const app = getApp()

Page({
  data: {
    categories: [],
    title:'分类',
  },
  onLoad: function() {
    util.loading()

    let that = this;

    api.getCategories().then((categories) => {
      if (config.debug) console.log('api.getCategories: ', categories);
      that.setData({
        categories: categories
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  onReady: function() {
    wx.hideLoading()
  },
  tabClick: function(e) {
    console.log(e)
  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})