const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    lists: [],
    wd: '',
    page: 1,
    size: 10,
    tabValue: "book",
    showTab: false,
    focus: false,
    tabs: [{
        title: "书籍",
        value: "book"
      },
      {
        title: "文档",
        value: "doc"
      }
    ],
    title:"搜索"
  },
  onLoad: function(options) {
    let wd = options.wd || ''
    if (wd == '') {
      this.setData({
        focus: true
      })
      return
    }
    this.setData({
      wd: wd,
      page: 1,
      lists: [],
      showTab: true,
    })
    this.execSearch(wd)
  },
  onReachBottom: function() {
    this.execSearch()
  },
  tabClick: function(e) {
    if (e.detail.value == this.data.tabValue) {
      return
    }
    this.setData({
      tabValue: e.detail.value,
      page: 1,
      lists: [],
      showTab: true
    })
    this.execSearch(this.data.wd)
  },
  search: function(e) {
    this.setData({
      wd: e.detail.wd,
      page: 1,
      lists: [],
      showTab: true
    })
    this.execSearch()
  },
  execSearch: function() {
    let that = this
    let api = config.api.searchDoc

    if (that.data.pedding) return

    if (that.data.page > 0) {
      that.setData({
        loading: true,
        pending: true,
      })
    } else {
      that.setData({
        loading: false,
        tips: '没有找到更多资源...',
        pedding: false,
      })
      return
    }

    if (that.data.tabValue != "doc") {
      api = config.api.searchBook
    }

    util.request(api, {
      wd: that.data.wd,
      page: that.data.page,
      size: that.data.size,
    }).then((res) => {
      if (config.debug) console.log(config.api.searchBook, res)
      let page = that.data.page + 1
      let result = []
      if (res.data && res.data.result) {
        result = res.data.result
        if (res.data.result.length < that.data.size) {
          page = 0
        }
      } else {
        page = 0
      }
      that.setData({
        page: page,
        lists: that.data.lists.concat(result),
        loading: page > 0,
        tips: "没有找到更多资源...",
        pedding: false,
      })
    }).catch((e) => {
      if (config.debug) console.log(e)
      that.setData({
        loading: false,
        tips: e.data.message || e.errMsg,
        page: 0,
        pedding: false,
      })
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})