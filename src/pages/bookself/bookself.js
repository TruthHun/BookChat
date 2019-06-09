const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    page: 1,
    size: 12,
    books: [],
    token: '',
    showTips: false,
    wd: '',
  },
  onLoad: function() {
  },
  onShow: function() {
    this.loadBooks()
  },
  onReachBottom: function() {
    this.loadBooks()
  },
  loadBooks: function() {
    let token = util.getToken() || ''
    if (!token) {
      this.setData({
        showTips: true,
        books: [],
        token: token,
      })
      return
    }

    let that = this

    if (that.data.page == 0) return
    util.request(config.api.bookshelf, {
      page: that.data.page,
      size: that.data.size,
    }).then((res) => {
      if (config.debug) console.log(config.api.bookshelf, res)
      if (res.data && res.data.books && res.data.readed) {
        let page = that.data.page
        if (res.data.books.length >= that.data.size) {
          page++
        } else {
          page = 0
        }
        this.setData({
          showTips: true,
          books: that.data.books.concat(res.data.books),
          token: token,
          page: page,
        })
      } else {
        this.setData({
          showTips: true,
          token: token,
          page: 1,
        })
      }
    }).catch((e) => {
      let books = that.data.books
      if (e.statusCode == 401) {
        token = ''
        util.clearUser()
        books = []
      }
      this.setData({
        showTips: true,
        token: token,
        books: books,
        showTips: true,
        page: 1,
      })
    })
  },
  login: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  search: function(e) {
    if (config.debug) console.log("search event", e)
    if (e.detail.value != '') {
      wx.navigateTo({
        url: '/pages/search/search?wd=' + e.detail.value,
      })
    }
  },
  formSubmit:function(e){
    if(this.data.wd!=''){
      wx.navigateTo({
        url: '/pages/search/search?wd=' + this.data.wd,
      })
    }
  },
  changeValue:function(e){
    this.setData({wd:e.detail.value})
  }
})