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
    tabValue: 'popular',
    tabTitle: '热门',
    categoryTitle: '书籍列表',
    size: 10,
    tips: '哼，我也是一只有底线的猿',
    tabs: [{
      title: '热门',
      value: 'popular'
    }, {
      title: '最新',
      value: 'new'
    }, {
      title: '推荐',
      value: 'recommend'
    }]
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
    that.loadBooks(true)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadBooks()
  },
  tabClick: function(e) {
    if (config.debug) console.log("tabClick", e)
    if (e.detail.tabValue == this.data.tabValue) return;
    this.setData({
      tabValue: e.detail.value,
      tabTitle: e.detail.title,
      page: 1,
      books: [],
    })
    this.loadBooks(true)
    this.setTitle()
  },
  loadBooks: function(isClearAll) {
    let that = this
    if (that.data.page == 0) return

    util.request(config.api.bookLists, {
      page: that.data.page,
      cid: that.data.cid,
      size: that.data.size,
      sort: that.data.tabValue
    }).then((res) => {
      if (config.debug) console.log(config.api.bookLists, res)

      let page = 0
      let books = that.data.books
      if (isClearAll) books = []

      if (res.data != undefined && res.data.books != undefined) {
        if (res.data.books.length >= that.data.size) page = that.data.page + 1
        books = books.concat(res.data.books)
      }

      let tips = '哼，我也是一只有底线的猿'

      if (books.length == 0) tips = '(-。-) 猿来没有内容'

      that.setData({
        page: page,
        books: books,
        tips: tips,
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  setTitle: function() {
    let that = this
    let tabTitle = that.data.tabTitle
    switch (that.data.tabValue) {
      case 'new':
        tabTitle = '最新';
        break
      case 'recommend':
        tabTitle = '推荐';
        break;
      case 'popular':
        tabTitle = '热门';
        break;
      default:
        tabTitle = '热门';
        break;
    }

    api.getCategoryByCid(that.data.cid).then((category) => {
      if (config.debug) console.log('api.getCategoryByCid', category)
      if (category && category.title) {
        that.setData({
          categoryTitle: category.title
        })
      }
      
    }).catch((e) => {
      console.log(e)
    }).finally(function(){
      wx.setNavigationBarTitle({
        title: that.data.categoryTitle + ' · ' + tabTitle,
      })
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})