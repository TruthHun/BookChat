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
    title:'书架',
  },
  onLoad: function() {},
  onShow: function() {
    if (config.debug) console.log("onShow", "bookshelfChanged", getApp().globalData.bookshelfChanged)
    this.loadBooks(getApp().globalData.bookshelfChanged)
    getApp().globalData.bookshelfChanged = false
  },
  onReachBottom: function() {
    this.loadBooks()
  },
  loadBooks: function(isClearAll) {
    wx.stopPullDownRefresh()

    let that = this
    let token = util.getToken() || ''

    if (token == '') {
      that.setData({
        showTips: true,
        books: [],
        token: token,
        pending: false,
        page: 1,
      })
      return
    }

    if ((that.data.pending || that.data.page == 0) && !isClearAll) return;

    that.setData({
      pending: true
    })

    let page = isClearAll ? 1 : that.data.page
    let size = that.data.size
    let data = {
      pending: false,
      token: token,
      books: that.data.books,
    }

    util.request(config.api.bookshelf, {
      page: page,
      size: size,
    }).then((res) => {
      if (config.debug) console.log(config.api.bookshelf, res)
      if (res.data && res.data.books) {
        res.data.books.length >= size ? page++ : page = 0
        data.books = isClearAll ? res.data.books : that.data.books.concat(res.data.books)
      } else {
        if (page == 1) {
          data.books = []
          data.showTips = true
        }
        page = 0
      }
      console.log(data.books)
      data.showTips = data.books.length == 0
      data.page = page
      that.setData(data)
      if (isClearAll) wx.pageScrollTo({
        scrollTop: 0,
      })
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    })
  },
  onPullDownRefresh: function() {
    util.loading()
    this.loadBooks(true)
    wx.hideLoading()
  },
  login: function(e) {
    wx.navigateTo({
      url: '/pages/login/login?redirect='+encodeURIComponent('/pages/bookshelf/bookshelf'),
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
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})