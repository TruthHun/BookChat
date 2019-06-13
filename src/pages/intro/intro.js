const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    book: {},
    isLogin: util.getToken() != "",
  },
  onLoad: function(options) {
    util.loading()

    if (config.debug) console.log(options)

    let id = parseInt(options.id)
    if (options.id == undefined || id <= 0) {
      wx.navigateTo({
        url: '/pages/notfound/notfound',
      })
      return
    }

    let that = this
    util.request(config.api.bookInfo, {
      identify: id
    }).then((res) => {
      if (config.debug) console.log(config.api.bookInfo, res)
      let book = res.data.book
      wx.setNavigationBarTitle({
        title: book.book_name,
      })
      book.float_score = (book.score / 10).toFixed(1)
      book.description = book.description || book.book_name
      book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
      that.setData({
        book
      })
    })

    util.request(config.api.bookRelated, {
      book_id: id
    }).then((res) => {
      if (config.debug) console.log(config.api.bookRelated, res)
      if (res.data.books) that.setData({
        relatedBooks: res.data.books
      })
    })
  },
  onReady: function() {
    wx.hideLoading()
  }
})