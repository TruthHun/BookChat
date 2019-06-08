let config = require('../../config.js')
let util = require('../../utils/util.js')
let api = require('../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'star',
    page: 1,
    size: 10,
    lists: [],
    user: {},
    tips: '我也是一只有底线的猿...',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (config.debug) console.log("params", options)

    let user = util.getUser() || {
      uid: 0
    }
    let uid = options.uid || 0
    if (!uid && user != undefined && user.uid != undefined) {
      uid = user.uid
    }

    if (!uid) {
      wx.navigateTo({
        url: '/pages/notfound/notfound',
      })
      return
    }

    if (uid != user.uid) {
      util.request(config.api.userInfo, {
        uid: uid
      }).then((res) => {
        if (config.debug) console.log(config.api.userInfo, res)
        if (res.data && res.data.user) {
          user = res.data.user
        } else {
          user.uid = uid
        }
        this.setData({
          user: user
        })
      }).catch((e) => {
        console.log(e)
        wx.navigateTo({
          url: '/pages/notfound/notfound',
        })
      })
    } else {
      this.setData({
        user: user
      })
    }

    this.setTitile()
    this.getLists()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    switch (this.data.tab) {
      case 'release':
        this.getRelease();
        break;
      case 'star':
        this.getStar();
        break;
      case 'fans':
        this.getFans();
        break;
      case 'follow':
        this.getFollow()
        break;
    }
  },
  tabClick: function(e) {
    if (config.debug) console.log("tabClick", e)

    if (e.target.dataset.tab == this.data.tab) return;

    this.setData({
      lists: [],
      page: 1,
      tab: e.target.dataset.tab,
    })
    this.getLists()
    this.setTitile(e.target.dataset.title)
  },
  getLists: function() {
    switch (this.data.tab) {
      case 'release':
        this.getRelease()
        break;
      case 'star':
        this.getStar()
        break;
      case 'follow':
        this.getFollow()
        break;
      case 'fans':
        this.getFans()
        break;
    }
  },
  getRelease: function() {
    let that = this
    let page = that.data.page

    if (page == 0) return

    let lists = []

    if (page > 1) lists = that.data.lists

    util.request(config.api.userRelease, {
      uid: that.data.user.uid,
      page: page
    }).then((res) => {
      if (config.debug) console.log(config.api.userRelease, res)
      if (res.data && res.data.books && res.data.books.length > 0) {
        if (res.data.books.length < that.data.size) {
          page = 0
        } else {
          page++
        }
        lists = lists.concat(res.data.books)
      }
      that.setData({
        lists: lists,
        page: page
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  getStar: function() {
    let that = this
    let page = that.data.page

    if (page == 0) return

    let lists = []

    if (page > 1) lists = that.data.lists

    util.request(config.api.bookshelf, {
      uid: that.data.user.uid,
      page: page,
    }).then((res) => {
      if (config.debug) console.log(config.api.bookshelf, res)

      if (res.data && res.data.books && res.data.books.length > 0) {
        if (res.data.books.length < that.data.size) {
          page = 0
        } else {
          page++
        }
        lists = lists.concat(res.data.books)
      }

      that.setData({
        lists: lists,
        page: page
      })

    }).catch((e) => {
      console.log(e)
    })
  },
  getFollow: function() {

  },
  getFans: function() {

  },
  setTitile(title) {
    if (title == undefined || title == '') title = '收藏'
    wx.setNavigationBarTitle({
      title: title,
    })
  }
})