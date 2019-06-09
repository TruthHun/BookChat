const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    book:{}
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '玩命加载中...',
    })

    let id = parseInt(options.id)
    if (id<=0){
      wx.navigateTo({
        url: '/pages/notfound/notfound',
      })
      return
    }

    let that = this
    util.request(config.api.bookInfo, { identify:id}).then((res)=>{
      if (config.debug) console.log(config.api.bookInfo,res)
      let book=res.data.book
      wx.setNavigationBarTitle({
        title: book.book_name,
      })
      book.float_score = (book.score/10).toFixed(1)
      book.description = book.description || book.book_name
      that.setData({book})
    })

    util.request(config.api.bookRelated,{book_id:id}).then((res)=>{
      if (config.debug) console.log(config.api.bookRelated, res)
      if(res.data.books) that.setData({ relatedBooks:res.data.books })
    })
  },
  onReady:function(){
    wx.hideLoading()
  }
})
