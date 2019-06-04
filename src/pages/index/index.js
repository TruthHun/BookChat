// index.js
// 获取应用实例
const app = getApp()
const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    userInfo: {},
    banners: {},
    categoryBooks: [],
    recommendBooks: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  onLoad: function() {
    wx.showLoading({
      title: '玩命加载中...',
    })

    let that = this

    api.getBanners(function(res) {
      if (config.debug) console.log('api.getBanners:', res)
      if (res.data.data.banners && res.data.data.banners.length > 0) {
        that.setData({
          banners: res.data.data.banners
        })
      }
    })

    api.getCategories(function(res) {
      if (config.debug) console.log('api.getCategories:', res)
      if (res.length > 0) {
        let cids = []
        let categories = res.filter(function(category) {
          let b = category.pid == 0 && category.cnt > 0
          if (b) cids.push(category.id)
          return b
        })
        if (cids.length > 0) {
          api.getBooksByCids(cids.join(","), 1, 5, "new", function(books) {
            if (config.debug) console.log('api.getBooksByCids:', books)
            let categoryBooks = categories.map(function(category) {
              let book = books[category.id]
              if (book != undefined && book.length > 0) {
                book = book.map(function(item){
                  item.created_at = util.relativeTime(item.created_at)
                  return item
                })
                category.books = book
              } else {
                category.books = []
              }
              return category
            })
            if (config.debug) console.log('categoryBooks:', categoryBooks)
            that.setData({
              categoryBooks: categoryBooks
            })
          })
        }
      }
    })

    // 获取最新推荐
    api.getBooks(1, 10, "latest-recommend", 0, function(res) {
      if (config.debug) console.log("api.getBooks,recommenBooks:", res)
      that.setData({
        "recommendBooks": res
      })
    })
  },
  onReady: function() {
    wx.hideLoading()
  }
})