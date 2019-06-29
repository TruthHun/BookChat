const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {},
    article: {},
    menuSortIds: [],
    menuTree: [],
    menuIndex: 0,
    bookmark: [], //书签
    showMenu: false,
    showMore: false,
    wd: '', //搜索关键字
    bg: '#fff', // background-color
    // fontSize: '28rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 步骤：
    // 1. 先获取书籍目录
    // 2. 如果没传文档标识参数，则用目录的首个章节作为默认获取的文章
    let that = this;
    let identify = options.identify || 'help'
    let arr = String(identify).split("/")
    let book = {}
    let menu = []

    if (arr.length == 0) {
      wx.redirectTo({
        url: '/pages/notfound/notfound',
      })
      return
    }

    util.loading()

    Promise.all([util.request(config.api.bookMenu, {
      identify: arr[0]
    }), util.request(config.api.bookInfo, {
      identify: arr[0]
    })]).then(function([resMenu, resBook]) {
      if (config.debug) console.log(resMenu, resBook)
      if (resMenu.data && resMenu.data.menu) {
        menu = resMenu.data.menu
      }
      if (resBook.data && resBook.data.book) {
        book = resBook.data.book
        book.score_float = Number(book.score / 10).toFixed(1)
        book.is_read = 1
        book.percent = Number(book.cnt_readed / book.cnt_doc * 100).toFixed(2)
      }
    }).catch(function(e) {
      console.log(e)
    }).finally(function() {
      if (menu.length == 0) {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }

      let menuTree = util.menuToTree(menu)

      that.setData({
        menuSortIds: util.menuSortIds(menuTree),
        menuTree: menuTree,
        book: book,
      })

      if (arr.length < 2) {
        identify = book.book_id + "/" + menuTree[0].id
      }

      that.getArticle(identify)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  getArticle: function(identify) {
    let article = {}
    let that = this
    util.request(config.api.read, {
      identify: identify
    }).then(function(res) {
      if (res.data && res.data.article) {
        article = res.data.article
      }
    }).catch(function(e) {
      if (e.errMsg) {
        util.toastError(e.errMsg)
      } else {
        util.toastError(e.data.message)
      }
    }).finally(function() {
      if (article.content == '') {
        article.content = '<div style="color:#888;margin:100px auto;text-align:center;"> -- 本章节内容为空 -- </div>'
      }
      that.setData({
        article: article,
        identify: identify,
        showMenu: false,
        showMore: false,
        menuTree: util.menuTreeReaded(that.data.menuTree, article.id),
      })
      if (article.title) wx.setNavigationBarTitle({
        title: article.title,
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })
      wx.hideLoading()
    })
  },
  contentClick: function(e) {
    this.setData({
      showMenu: false,
      showMore: false
    })
  },
  clickMenu: function(e) {
    this.setData({
      showMenu: !this.data.showMenu,
      showMore: false,
    })
  },
  clickMore: function(e) {
    this.setData({
      showMore: !this.data.showMore,
      showMenu: false,
    })
  },
  clickNext: function(e) {
    let that = this
    let idx = that.data.menuSortIds.indexOf(that.data.article.id)
    idx++
    if (idx < that.data.menuSortIds.length) {
      util.loading()
      that.getArticle(that.data.book.book_id + "/" + that.data.menuSortIds[idx])
    } else {
      wx.showToast({
        title: '没有下一章节了',
        mask: true,
        image: '/assets/images/error.png'
      })
    }
  },
  clickPrev: function(e) {
    let that = this
    let idx = that.data.menuSortIds.indexOf(that.data.article.id)
    idx--
    if (idx > -1) {
      util.loading()
      that.getArticle(that.data.book.book_id + "/" + that.data.menuSortIds[idx])
    } else {
      wx.showToast({
        title: '没有上一章节了',
        mask: true,
        image: '/assets/images/error.png'
      })
    }
  },
  itemClick: function(e) {
    util.loading()
    this.getArticle(e.detail.identify)
  },
  search: function(e) {
    let that = this
    let result = []

    if(that.data.wd==e.detail.wd) return;

    util.loading("玩命搜索中...")
    util.request(config.api.searchDoc, {
      identify: that.data.book.book_id,
      wd: e.detail.wd
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
        wd: e.detail.wd,
      })
      wx.hideLoading()
      if (result.length == 0) {
        util.toastError("没有搜索到结果")
      }
    })
  },
  clear: function(e) {
    this.setData({
      result: []
    })
  }
})