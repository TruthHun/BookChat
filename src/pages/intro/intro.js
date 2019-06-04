const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    motto: 'Hello World'
  },
  onLoad: function (options) {
    wx.redirectTo({
      url: '/pages/notfound/notfound',
    })
    let id = parseInt(options.id)
    console.log(options)
  }
})
