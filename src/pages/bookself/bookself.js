const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    page: 1,
    size: 24,
    books: [],
    token: '',
    showTips: false,
    pending: false,
    wd: '',
  },
  onLoad: function() {
    this.loadBooks()
  },
  onShow: function() {
    this.loadBooks()
  },
  onReachBottom: function() {
    this.loadBooks()
  },
  loadBooks: function() {
    wx.stopPullDownRefresh()

    if (this.data.pending) return;

    this.setData({
      pending: true
    })

    let token = util.getToken() || ''
    if (!token) {
      this.setData({
        showTips: true,
        books: [],
        token: token,
        pending: false,
      })
      return
    }

    let that = this

    if (that.data.page == 0) return
    util.request(config.api.bookshelf, {
      page: that.data.page,
      size: that.data.size,
    }).then((res) => {
      if (config.debug) console.log(config.api.bookshelf, res)
      if (res.data && res.data.books) {
        let page = that.data.page
        if (res.data.books.length >= that.data.size) {
          page++
        } else {
          page = 0
        }
        this.setData({
          showTips: that.data.books.length == 0,
          books: that.data.books.concat(res.data.books),
          token: token,
          page: page,
          pending: false,
        })
      } else {
        this.setData({
          showTips: true,
          token: token,
          page: 1,
          pending: false,
        })
      }
    }).catch((e) => {
      let books = that.data.books
      if (e.statusCode == 401) {
        token = ''
        util.clearUser()
        books = []
      }
      this.setData({
        showTips: true,
        token: token,
        books: books,
        showTips: true,
        page: 1,
        pending: false,
      })
    })
  },
  onPullDownRefresh:function(){
    util.loading()
    this.loadBooks()
    wx.hideLoading()
  },
  login: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  search: function(e) {
    wx.navigateTo({
      url: '/pages/search/search?wd=' + e.detail.wd,
    })
  },
  formSubmit: function(e) {
    if (this.data.wd != '') {
      wx.navigateTo({
        url: '/pages/search/search?wd=' + this.data.wd,
      })
    }
  },
  changeValue: function(e) {
    this.setData({
      wd: e.detail.value
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})