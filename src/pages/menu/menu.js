const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const config = require('../../config.js')

Page({
  data: {
    book: {},
    menuTree: [],
    identify: '',
    wd: '',
    token: '目录',

  },
  onLoad: function(options) {
    let identify = options.id || options.identify || 'dochub';
    if (!identify || identify == undefined) {
      wx.redirectTo({
        url: '/pages/notfound/notfound',
      })
      return
    }
    this.setData({
      identify: identify,
    })
  },
  onShow: function() {
    this.setData({
      token: util.getToken() || ''
    })
    this.loadData()
  },
  search: function(e) {
    console.log(e)
  },
  loadData: function() {
    let that = this
    let menu = []
    let book = {}
    let identify = that.data.identify
    if (that.data.book.book_id > 0) {
      return
    }
    util.loading()

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
        book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      if (menu.length == 0) {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }
      that.setData({
        menuTree: util.menuToTree(menu),
        book: book,
        title: '目录 · ' + book.book_name,
      })
      wx.hideLoading()
    })
  },
  itemClick: function(e) {
    wx.navigateTo({
      url: '/pages/read/read?identify=' + e.detail.identify,
    })
  },
  search: function(e) {
    util.loading("玩命搜索中...")
    let that = this
    let result = []
    util.request(config.api.searchDoc, {
      identify: that.data.identify,
      wd: e.detail.wd
    }).then(function(res) {
      if (config.debug) console.log(config.api.searchDoc, res)
      if (res.data && res.data.result) {
        result = res.data.result
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      that.setData({
        result: result,
        wd: e.detail.wd,
      })
      wx.hideLoading()
      if (result.length == 0) {
        util.toastError("没有搜索到结果")
      }
    })
  },
  clear: function(e) {
    this.setData({
      result: []
    })
  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})