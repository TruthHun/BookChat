const api = require('../../utils/api.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    cid:0,
    books: [],
    tab: 'new',
    navigateTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let category = {}
    let title = options.title ? options.title : '列表'

    let cid = parseInt(options.cid)
    if (cid<=0){
      wx.redirectTo({
        url: '/pages/notfound/notfound',
      })
    }

    api.getCategoryByCid(cid,function(res){
      category = res
    })
    
    if(confid.debug) console.log("api.getCategoryByCid:",category)
    
    wx.setNavigationBarTitle({
      title: title,
    })

    api.getBooks(1,10,'new',cid,function(books, total){
      if (config.debug) console.log("api.getBooks:",options, books)
      that.setData({total:total,cid:cid,books:books})
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})