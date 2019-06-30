const config = require('../../config.js')
const api = require('../../utils/api.js')
const util = require('../../utils/util.js')

Page({
  data: {
    banners: [],
    categoryBooks: [],
    recommendBooks: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    width: '100%',
    height: '150px',
    wd: '',
    pending: false,
    showSearch: false,
  },
  onLoad: function() {
    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
    let info = wx.getSystemInfoSync()
    let width = info.windowWidth * info.pixelRatio - 60; // 转成 rpx，因为小程序边距设置为 30rpx
    let height = width / config.bannerRatio
    this.setData({
      width: width / info.pixelRatio + "px",
      height: height / info.pixelRatio + "px"
    })
    util.loading()
    this.loadData()
  },
  onPullDownRefresh: function() {
    this.onLoad()
  },
  loadData: function() {
    let that = this
    if (that.data.pending) return
    that.setData({
      pending: true
    })

    let cids = []
    let categories = []

    api.getCategories().then(function(res) {
      if (res.length > 0) {
        categories = res.filter(function(category) {
          let b = category.pid == 0 && category.cnt > 0
          if (b) cids.push(category.id)
          return b
        })
      }
      if (config.debug) console.log(res, categories, cids)
    }).catch(function(e) {
      console.log("api.getCategories()", e)
    }).finally(function() {

      let banners = []
      let recommendBooks = []
      let bookLists = []

      Promise.all([util.request(config.api.banners), util.request(config.api.bookLists, {
        page: 1,
        size: 12,
        sort: 'latest-recommend'
      }), util.request(config.api.bookListsByCids, {
        page: 1,
        size: 5,
        sort: 'new',
        cids: cids.join(',')
      })]).then(function([resBanners, resRecommendBooks, resBookLists]) {
        if (config.debug) console.log(cids, resBanners, resRecommendBooks, resBookLists)

        if (resBanners.data && resBanners.data.banners) banners = resBanners.data.banners
        if (resRecommendBooks.data && resRecommendBooks.data.books) recommendBooks = resRecommendBooks.data.books

        if (resBookLists.data && resBookLists.data.books) {
          categories = categories.map(function(category) {
            let book = resBookLists.data.books[category.id]
            if (book != undefined && book.length > 0) {
              category.books = book
            } else {
              category.books = []
            }
            return category
          })
        }
      }).catch(function(e) {
        console.log(e)
      }).finally(function() {
        that.setData({
          banners: banners,
          categoryBooks: categories,
          recommendBooks: recommendBooks,
          showSearch: true,
          pending: false,
        })
        wx.hideLoading()
      })
    })
  },
  search: function(e) {
    wx.navigateTo({
      url: '/pages/search/search?wd=' + e.detail.wd,
    })
  }
})