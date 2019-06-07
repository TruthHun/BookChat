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
    util.loading()

    let that = this

    util.request(config.api.banners).then((res) => {
      if (config.debug) console.log('api.getBanners:', res)
      if (res.data.banners && res.data.banners.length > 0) {
        that.setData({
          banners: res.data.banners
        })
      }
    }).catch((e) => {
      console.log(e)
    })

    util.request(config.api.bookLists, {
      page: 1,
      size: 12,
      sort: 'latest-recommend'
    }).then((res) => {
      if (config.debug) console.log(config.api.bookLists, res)
      if (res.data.books) {
        that.setData({
          "recommendBooks": res.data.books
        })
      }
    }).catch((e) => {
      console.log(e)
    })

    api.getCategories().then(function(res) {
      if (config.debug) console.log('api.getCategories:', res)
      if (res.length > 0) {
        let cids = []
        let categories = res.filter(function(category) {
          let b = category.pid == 0 && category.cnt > 0
          if (b) cids.push(category.id)
          return b
        })
        if (cids.length > 0) {
          util.request(config.api.bookListsByCids,{
            page: 1, size: 5, sort: 'new', cids: cids
          }).then((res)=> {
            let books = res.data.books
            if (config.debug) console.log(config.api.bookListsByCids, books)
            let categoryBooks = categories.map(function(category) {
              let book = books[category.id]
              if (book != undefined && book.length > 0) {
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
    }).catch(function(e) {
      console.log(e)
    })
  },
  onReady: function() {
    wx.hideLoading()
  }
})