const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    bookId: 0,
    book: {},
    relatedBooks: [],
    isLogin: util.getToken() != "",
    page: 1,
    size: 10,
    myScore: 0,
    comments: [],
    title:'BookChat',
  },
  onLoad: function(options) {
    if (config.debug) console.log(options)

    let id = options.id || options.scene

    if (id == undefined || id == NaN || id <= 0) {
      if (config.debug) {
        id = 2180
      } else {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }
    }

    this.setData({
      bookId: id
    })
    this.loadData()
  },
  onShow: function() {
    this.setData({
      isLogin: util.getToken() != ""
    })
  },
  onPullDownRefresh: function() {
    this.setData({
      page: 1
    })
    this.loadData()
  },
  loadData: function() {
    wx.stopPullDownRefresh()

    util.loading()

    let that = this
    let book = {}
    let books = []

    Promise.all([util.request(config.api.bookInfo, {
      identify: that.data.bookId
    }), util.request(config.api.bookRelated, {
      identify: that.data.bookId
    })]).then(function([resInfo, resRelated]) {
      if (config.debug) console.log(resInfo, resRelated)

      if (resInfo.data && resInfo.data.book) {
        book = resInfo.data.book
        switch (book.lang) {
          case 'zh':
            book.lang = '中文';
            break;
          case 'en':
            book.lang = '英文';
            break;
          default:
            book.lang = '其他';
            break;
        }
      }
      if (resRelated.data && resRelated.data.books) {
        books = resRelated.data.books
      }
    }).catch(function(e) {
      wx.hideLoading()
      util.toastError(e.data.message || e.errMsg)
    }).finally(function() {
      if (book.book_id <= 0) {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }
      book.float_score = (book.score / 10).toFixed(1)
      book.description = book.description || book.book_name
      book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
      that.setData({
        book: book,
        relatedBooks: books,
        page: 1,
        title: book.book_name,
      })
      wx.hideLoading()
      that.getComments()
    })
  },
  onReachBottom: function() {
    this.getComments()
  },
  getComments: function() {
    let that = this
    let comments = that.data.comments
    let myScore = 0

    if (that.data.page <= 0 || that.data.pending) {
      return
    }
    that.setData({
      pending: true
    })

    util.request(config.api.comment, {
      identify: that.data.bookId,
      page: that.data.page,
    }).then(function(res) {
      if (config.debug) console.log(config.api.comment, res)
      if (res.data && res.data.comments) {
        if (that.data.page == 1) {
          comments = res.data.comments
        } else {
          comments = comments.concat(res.data.comments)
        }
      }
      if (res.data && res.data.my_score) myScore = res.data.my_score
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      that.setData({
        comments: comments,
        page: comments.length >= that.data.size ? (that.data.page + 1) : 0,
        pending: false,
        myScore: myScore
      })
    })
  },
  comment: function(e) {
    let that = this
    let url = e.currentTarget.dataset.url

    if (config.debug) console.log(e, url)

    if (!that.data.isLogin) {
      wx.showModal({
        title: '温馨提示',
        content: '您当前未登录，无法发表点评，您是否要先登录？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?redirect=' + encodeURIComponent(url),
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: url,
      })
    }
  },
  bookStar: function(e) {
    let that = this
    if (!that.data.isLogin) {
      wx.showModal({
        title: '温馨提示',
        content: '您当前未登录，无法将书籍收藏到书架，您是否要先登录？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/intro/intro?id=' + that.data.bookId),
            })
          }
        }
      })
    } else {
      that._bookStar(e)
    }
  },
  _bookStar: function(e) {
    if (config.debug) console.log("bookStar", e)

    let that = this
    let book = that.data.book

    util.request(config.api.bookStar, {
      identify: book.book_id
    }).then(function(res) {
      if (config.debug) console.log(config.api.bookStar, res)
      if (res.data.data && res.data.data.is_cancel) {
        book.is_star = false
      } else {
        book.is_star = true
      }
      that.setData({
        book: book
      })
      wx.showToast({
        title: book.is_star ? '收藏书籍成功' : '移除收藏成功',
      })
      getApp().globalData.bookshelfChanged = true
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    })
  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})