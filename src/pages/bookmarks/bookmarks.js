const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    bookmarks: [],
    title:'我的书签'
  },
  onLoad: function(options) {
    if (config.debug) console.log("options", options)
    this.setData({
      identify: options.identify ? options.identify : ''
    })
  },
  onShow: function() {
    this.loadBookmarks()
  },
  loadBookmarks: function() {
    let that = this
    if (that.data.identify) {
      let bookmarks = []
      util.loading()
      util.request(config.api.bookmark, {
        identify: that.data.identify
      }).then(function(res) {
        if (config.debug) console.log("config.api.bookmark", res)
        if (res.data && res.data.bookmarks) {
          bookmarks = res.data.bookmarks
        }
      }).catch(function(e) {
        console.log(e)
      }).finally(function() {
        that.setData({
          bookmarks: bookmarks,
          tips: bookmarks.length > 0 ? '' : ' -- 您暂时还有没有书签 -- '
        })
        wx.hideLoading()
      })
    }
  },
  delBookmark: function(e) {
    if (config.debug) console.log("delBookmark", e)
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要删除该书签吗？',
      success: function(res) {
        if (res.confirm) {
          util.loading("正在删除...")
          util.request(config.api.bookmark + "?doc_id=" + e.currentTarget.dataset.id, {}, 'DELETE').then(function(res) {
            if (config.debug) console.log(res)
          }).catch(function(e) {
            console.log(e)
          }).finally(function() {
            let bookmarks = that.data.bookmarks
            bookmarks = bookmarks.filter(bookmark => {
              return bookmark.doc_id != e.currentTarget.dataset.id
            })
            that.setData({
              bookmarks: bookmarks,
              tips: bookmarks.length > 0 ? '' : ' -- 您暂时还有没有书签 -- ',
            })
            wx.hideLoading()
          })
        }
      }
    })
  }
})