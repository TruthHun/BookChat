const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    book:{}
  },
  onLoad: function (options) {
    let id = parseInt(options.id)
    if (id<=0){
      wx.redirectTo({
        url: '/pages/notfound/notfound',
      })
      return
    }

    let that = this

    api.getBook(id,function(book){
      if(config.debug) console.log("api.getBook：",book)
      wx.setNavigationBarTitle({
        title: book.book_name,
      })
      book.updated_at=util.relativeTime(book.updated_at)
      book.float_score = (book.score/10).toFixed(1)
      that.setData({book})
    })

    api.getRelatedBooks(id,function(books){
      if (config.debug) console.log("api.getRelatedBooks: ", books)
      that.setData({ relatedBooks:books })
    })

  }
})
