const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    book: {},
    article: {},
    menuSortIds: [],
    menuTree: [],
    menuIndex: 0,
    bookmark: [], //书签
    showMenu: false,
    showMore: false,
    preDisable: false,
    nextDisable: false,
    wd: '', //搜索关键字
    setting: {
      themeIndex: 0,
      fontIndex: 0,
    },
    defautScreenBrightness: 0,
    screenBrightness: 0,
    showFooter: true,
    fontIndexs: ['30rpx', '32rpx', '34rpx', '36rpx', '38rpx', '40rpx', '42rpx'],
    title: '',
  },
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

    if (wx.getSystemInfoSync().windowWidth >= 700) {
      let fontIndexs = ['22rpx', '24rpx', '26rpx', '28rpx', '30rpx', '32rpx', '34rpx']
      that.setData({
        fontIndexs: fontIndexs,
      })
    }

    that.initReaderSetting()

    util.loading()

    let latestReadId = 0

    Promise.all([util.request(config.api.bookMenu, {
      identify: arr[0]
    }), util.request(config.api.bookInfo, {
      identify: arr[0]
    })]).then(function([resMenu, resBook]) {
      if (config.debug) console.log(resMenu, resBook)
      if (resMenu.data && resMenu.data.menu) {
        menu = resMenu.data.menu
      }
      if (resMenu.data && resMenu.data.latest_read_id){
        latestReadId = resMenu.data.latest_read_id
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
      let app = getApp().globalData
      let top = app.statusBarHeight + app.titleBarHeight

      if (config.debug) console.log("top: ",top)

      that.setData({
        menuSortIds: util.menuSortIds(menuTree),
        menuTree: menuTree,
        book: book,
        title: book.book_name,
        top: top,
      })
      
      if (latestReadId>0){
        identify = book.book_id + "/" + latestReadId
      }else if (arr.length < 2) {
        identify = book.book_id + "/" + menuTree[0].id
      }
      that.getArticle(identify)
    })
  },
  onReachBottom: function() {
    this.setData({
      showFooter: true
    })
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
      let message = e.data.message || e.errMsg
      util.toastError(message)
    }).finally(function() {
      if (article.content == '') {
        article.content = '<div style="color:#888;margin:100px auto;text-align:center;"> -- 本章节内容为空 -- </div>'
      }

      let nextDisable = that.data.menuSortIds.indexOf(article.id) + 1 == that.data.menuSortIds.length
      let preDisable = that.data.menuSortIds.indexOf(article.id) == 0

      that.setData({
        article: article,
        identify: identify,
        showMenu: false,
        showMore: false,
        nextDisable: nextDisable,
        preDisable: preDisable,
        menuTree: util.menuTreeReaded(that.data.menuTree, article.id),
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })
      wx.hideLoading()
    })
  },
  contentClick: function(e) {
    if (config.debug) console.log('contentClick', e)
    this.setData({
      showMenu: false,
      showMore: false,
      showFooter: this.data.showMenu == true || this.data.showMore == true ? this.data.showFooter : !this.data.showFooter,
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
  clickNext: function() {
    let that = this
    that.setData({
      nextDisable: true
    })
    let idx = that.data.menuSortIds.indexOf(that.data.article.id)
    idx++
    if (idx < that.data.menuSortIds.length) {
      util.loading('加载下一章节...')
      that.getArticle(that.data.book.book_id + "/" + that.data.menuSortIds[idx])
    } else {
      wx.showToast({
        title: '没有下一章节了',
        mask: true,
        image: '/assets/images/error.png'
      })
    }
  },
  clickPrev: function() {
    let that = this
    that.setData({
      preDisable: true
    })
    let idx = that.data.menuSortIds.indexOf(that.data.article.id)
    idx--
    if (idx > -1) {
      util.loading('加载上一章节...')
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

    if (that.data.wd == e.detail.wd) return;

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
  },
  clickBookmark: function(e) {
    let that = this

    if (util.getToken() == '') {
      wx.showModal({
        title: '温馨提示',
        content: '您当前未登录，无法添加书签，是否要跳转登录？',
        success: function(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/read/read?identify=' + that.data.book.book_id + '/' + that.data.article.id),
            })
          }
        }
      })
    } else {
      if (e.currentTarget.dataset.action == "cancel") {
        wx.showModal({
          title: '温馨提示',
          content: '您确定要取消该书签吗？',
          success: function(res) {
            if (res.confirm) {
              that._clickBookmark('cancel')
            }
          }
        })
      } else {
        that._clickBookmark('add')
      }
    }
  },
  setFont: function(e) {
    // 0 ~ 6
    if (config.debug) console.log(e)
    let that = this
    let setting = that.data.setting
    if (e.currentTarget.dataset.action == 'minus') {
      if (setting.fontIndex > 0) setting.fontIndex = setting.fontIndex - 1
    } else {
      if (setting.fontIndex < 6) setting.fontIndex = setting.fontIndex + 1
    }
    that.setData({
      setting: setting
    })
    util.setReaderSetting(Object(setting))
  },
  setTheme: function(e) {
    if (config.debug) console.log(e)
    // 0 ~ 4
    let that = this
    let setting = that.data.setting
    if (e.currentTarget.dataset.theme >= 0 && e.currentTarget.dataset.theme < 5) {
      setting.themeIndex = e.currentTarget.dataset.theme
    } else {
      setting.themeIndex = 0
    }
    that.setData({
      setting: setting
    })
    util.setReaderSetting(Object(setting))
  },
  setBrightnessScreen: function(e) {
    if (config.debug) console.log(e)
    this.setData({
      screenBrightness: e.detail.value
    })
    wx.setScreenBrightness({
      value: e.detail.value,
    })
  },
  initReaderSetting: function() {
    let setting = util.getReaderSetting()
    let screenBrightness = 0
    wx.getScreenBrightness({
      success: function(res) {
        screenBrightness = res.value
      }
    })
    this.setData({
      setting: setting,
      defautScreenBrightness: screenBrightness,
      screenBrightness: screenBrightness,
    })
  },
  resetSetting: function() {
    let setting = {
      fontIndex: 0,
      themeIndex: 0,
    }
    this.setData({
      setting: setting,
      screenBrightness: this.data.defautScreenBrightness,
    })
    util.setReaderSetting(setting)
  },
  _clickBookmark: function(action) {
    let that = this
    let article = this.data.article
    let method = action == "cancel" ? 'DELETE' : 'PUT'

    util.request(config.api.bookmark + "?doc_id=" + article.id, {}, method).then(function(res) {
      if (config.debug) console.log(config.api.bookmark + "?doc_id=" + article.id, res)
      article.bookmark = !article.bookmark
      that.setData({
        article: article
      })
      wx.showToast({
        title: action == "cancel" ? '移除书签成功' : '添加书签成功'
      })
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    })
  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})