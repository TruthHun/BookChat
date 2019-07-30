let config = require('../../config.js')
let util = require('../../utils/util.js')
let api = require('../../utils/api.js')

Page({
  data: {
    tabValue: 'release',
    page: 1,
    size: 10,
    lists: [],
    user: {},
    tips: '没有发现更多资猿...',
    tabs: [{
      title: '发布',
      value: "release"
    }, {
      title: "收藏",
      value: "star",
    }, {
      title: "关注",
      value: "follow"
    }, {
      title: "粉丝",
      value: "fans"
    }]
  },
  onLoad: function(options) {
    if (config.debug) console.log("params", options)
    if (options.tab) this.setData({
      tabValue: options.tab
    })

    let user = util.getUser() || {
      uid: 0
    }

    let uid = options.uid || 0


    if (!uid && user != undefined && user.uid != undefined) {
      uid = user.uid
    }

    if (!uid) {
      wx.redirectTo({
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
        this.getLists()
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
      this.getLists()
    }

    this.setTitile()
  },
  onReachBottom: function() {
    switch (this.data.tabValue) {
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

    if (e.detail.value == this.data.tabValue) return;

    this.setData({
      lists: [],
      page: 1,
      tabValue: e.detail.value,
    })
    this.getLists()
    this.setTitile(e.target.dataset.title)
  },
  getLists: function() {
    switch (this.data.tabValue) {
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
    this._getBooks(config.api.userRelease)
  },
  getStar: function() {
    this._getBooks(config.api.bookshelf)
  },
  getFollow: function() {
    this._getFansOrFollow(config.api.userFollow)
  },
  getFans: function() {
    this._getFansOrFollow(config.api.userFans)
  },
  setTitile(title) {
    if (title == undefined || title == '') {
      switch (this.data.tabValue) {
        case 'release':
          title = '发布';
          break;
        case 'star':
          title = '收藏';
          break;
        case 'fans':
          title = '粉丝';
          break;
        case 'follow':
          title = '关注';
          break;
        default:
          title = '收藏';
          break;
      }
    }
    this.setData({title:title})
  },
  _getBooks: function(api) {
    let that = this
    let page = that.data.page

    if (page == 0) return

    let lists = []

    if (page > 1) lists = that.data.lists

    util.request(api, {
      uid: that.data.user.uid,
      page: page,
    }).then((res) => {
      if (config.debug) console.log(api, res)

      if (res.data && res.data.books && res.data.books.length > 0) {
        if (res.data.books.length < that.data.size) {
          page = 0
        } else {
          page++
        }
        lists = lists.concat(res.data.books)
      } else {
        page = 0
      }

      that.setData({
        lists: lists,
        page: page
      })

    }).catch((e) => {
      console.log(e)
    })
  },
  _getFansOrFollow: function(api) {
    let that = this
    let page = that.data.page

    if (page == 0) return

    let lists = []

    if (page > 1) lists = that.data.lists

    util.request(api, {
      uid: that.data.user.uid,
      page: page,
    }).then((res) => {
      if (config.debug) console.log(api, res)
      if (res.data && res.data.users && res.data.users.length > 0) {
        if (res.data.users.length < that.data.size) {
          page = 0
        } else {
          page++
        }
        lists = lists.concat(res.data.users)
      } else {
        page = 0
      }

      that.setData({
        lists: lists,
        page: page
      })
    }).catch((e) => {
      console.log(e)
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})