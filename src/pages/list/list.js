const api = require('../../utils/api.js')
const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    cid: 0,
    page: 1,
    books: [],
    tab: 'popular',
    tabTitle: '最新',
    categoryTitle: '书籍列表',
    size: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let cid = parseInt(options.cid)
    that.setData({
      cid: cid
    })
    that.setTitle()
    that.loadBooks()
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadBooks()
  },
  tabClick: function(e) {
    if (config.debug) console.log("tabClick", e)

    if (e.target.dataset.tab == this.data.tab) return;

    this.setData({
      tab: e.target.dataset.tab,
      tabTitle: e.target.dataset.title,
      page: 1,
      books: [],
    })
    this.loadBooks(true)
    this.setTitle()
  },
  loadBooks: function(isClearAll) {
    let that = this
    if (that.data.page == 0) return

    util.loading()

    util.request(config.api.bookLists, {
      page: that.data.page,
      cid: that.data.cid,
      size: that.data.size,
      sort: that.data.tab
    }).then((res) => {
      if (config.debug) console.log(config.api.bookLists, res)

      let page = 0
      let books = that.data.books
      if (isClearAll) books = []

      if (res.data != undefined && res.data.books != undefined) {
        if (res.data.books.length >= that.data.size) page = that.data.page + 1
        books = books.concat(res.data.books)
      }
      console.log(page)
      that.setData({
        page: page,
        books: books
      })
      wx.hideLoading()
    }).catch((e) => {
      console.log(e)
      wx.hideLoading()
    })
  },
  setTitle: function() {
    let that = this
    api.getCategoryByCid(that.data.cid).then((category) => {
      if (config.debug) console.log('api.getCategoryByCid', category)
      if (category && category.title) {
        that.setData({
          categoryTitle: category.title
        })
      }
      wx.setNavigationBarTitle({
        title: that.data.categoryTitle + ' - ' + that.data.tabTitle,
      })
    }).catch((e) => {
      console.log(e)
    })
  }
})