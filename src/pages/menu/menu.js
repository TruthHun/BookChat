const util = require('../../utils/util.js')
const api = require('../../utils/api.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [],
    token: util.getToken(),
    book: {},
    onHide: false,
    identify: '',
    activeTab: 'menu',
    bookmark: [],
    tips: '',
    wd: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let identify = options.id || options.identify || 'dochub';
    if (!identify || identify == undefined) {
      wx.navigateTo({
        url: '/pages/notfound/notfound',
      })
      return
    }
    let tab = options.tab || 'menu'

    this.setData({
      identify: identify,
      activeTab: tab
    })
    if (tab == 'menu') {
      this.loadData()
    } else {
      this.loadBookmark()
    }
  },
  onShow: function() {
    if (this.data.onHide) {
      this.setData({
        menu: util.menuToTree(util.getStorageMenu()),
        onHide: false
      })
    }
  },
  onHide: function() {
    this.setData({
      onHide: true
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  search: function(e) {
    console.log(e)
  },
  tabClick: function(e) {
    this.setData({
      activeTab: e.detail.tab
    })
    let title = ''
    if (e.detail.tab == 'bookmark') {
      title = '书签'
      this.loadBookmark()
    }else if (e.detail.tab == 'result') {
      title = '搜索 - ' + this.data.wd
    } else {
      title = '目录'
        this.loadData()
    }
    if (title) {
      wx.setNavigationBarTitle({
        title: title,
      })
    }

  },
  loadData: function() {
    let that = this
    let menu = []
    let book = {}
    let identify = that.data.identify

    if (that.data.book.book_id > 0) {
      return
    }
    util.loading()

    Promise.all([util.request(config.api.bookMenu, {
      identify: identify
    }), util.request(config.api.bookInfo, {
      identify: identify
    })]).then(function([resMenu, resBook]) {
      if (config.debug) console.log(resMenu, resBook)
      if (resMenu.data && resMenu.data.menu) {
        menu = resMenu.data.menu
      }
      if (resBook.data && resBook.data.book) {
        book = resBook.data.book
        book.score_float = Number(book.score / 10).toFixed(1)
        book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      if (menu.length == 0){
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }
      that.setData({
        menu: util.menuToTree(menu),
        book: book,
      })
      wx.hideLoading()
      util.setStorageMenu(menu)
    })
  },
  loadBookmark: function() {
    let that = this
    let bookmark = []
    wx.setNavigationBarTitle({
      title: '书签',
    })
    if (that.data.bookmark.length == 0) util.loading()
    util.request(config.api.bookmark, {
      identify: that.data.identify
    }).then(function(res) {
      if (config.debug) console.log("config.api.bookmark", res)
      if (res.data && res.data.bookmarks) {
        bookmark = res.data.bookmarks
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      that.setData({
        bookmark: bookmark,
        tips: ' -- 您暂时还有没有书签 -- '
      })
      wx.hideLoading()
    })
  },
  itemClick:function(e){
    // TODO: 设置已读章节，然后跳转到书籍阅读页面
    wx.navigateTo({
      url: '/pages/read/read?identify='+e.detail.identify,
    })
  },
  search: function(e) {
    util.loading("玩命搜索中...")
    let that = this
    let result = []
    util.request(config.api.searchDoc, {
      identify: that.data.identify,
      wd: e.detail
    }).then(function(res) {
      if (config.debug) console.log(config.api.searchDoc, res)
      if (res.data && res.data.result) {
        result = res.data.result
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      that.setData({
        result: result,
        activeTab: "result",
        wd: e.detail,
      })
      wx.hideLoading()
      if (result.length == 0) {
        util.toastError("没有搜索到结果")
      } else {
        wx.setNavigationBarTitle({
          title: '搜索 - ' + e.detail,
        })
      }
    })
  }
})