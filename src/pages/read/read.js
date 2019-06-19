const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    identify: '',
    article: {},
    content: {},
    menu: [],
    bookmark: [],//书签
    showMenu: false,
    showMore: false,
    wd: '', //搜索关键字
    bg: '#fff',// background-color
    fontSize: '28rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 步骤：
    // 1. 先获取书籍目录
    // 2. 如果没传文档标识参数，则用目录的首个章节作为默认获取的文章
    let that = this;
    let identify = options.identify || 'help/Ubuntu.md'

    that.getArticle(identify)
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
      })
      if (article.title) wx.setNavigationBarTitle({
        title: article.title,
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
  }
})