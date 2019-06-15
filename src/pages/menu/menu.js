const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [],
    token: util.getToken(),
    book: {},
    onHide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let identify = options.id || options.identify || 'docker-practice';
    util.loading()
    this.loadData(identify)
  },
  onShow: function() {
    if (this.data.onHide) {
      this.setData({
        menu: util.getStorageMenu(),
        onHide: false
      })
    }
  },
  onHide: function() {
    this.setData({
      onHide: true
    })
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
    let menu = []
    let book = {}

    Promise.all([util.request(config.api.bookMenu, {
      identify: identify
    }), util.request(config.api.bookInfo, {
      identify: identify
    })]).then(function([resMenu, resBook]) {
      if (config.debug) console.log(resMenu, resBook)
      if (resMenu.data && resMenu.data.menu) {
        menu = resMenu.data.menu
      }
      if (resBook.data && resBook.data.book) {
        book = resBook.data.book
        book.score_float = Number(book.score / 10).toFixed(1)
        book.percent = Number(book.cnt_readed / book.cnt_doc).toFixed(2)
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      that.setData({
        menu: menu,
        book: book,
      })
      wx.hideLoading()
      util.setStorageMenu(menu)
    })
  }
})