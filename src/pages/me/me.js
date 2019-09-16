// canvasdrawer来源：https://github.com/kuckboy1994/mp_canvas_drawer
// 海报背景图片来源： https://unsplash.com/photos/6jYoil2GhVk

const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    user: {},
    now: new Date().getFullYear(),
    info: config.info,
    title: '我的',
    showSharePoster: false,
    wechatUserInfo: {},
  },
  onLoad: function() {
    let that = this
    wx.getUserInfo({
      success: function(res) {
        that.setData({
          wechatUserInfo: res.userInfo
        })
      }
    })

    that.initUser()
  },
  onShow: function() {
    this.initUser()
  },
  onUnload: function() {
    this.initUser()
  },
  initUser: function() {
    let that = this
    let user = util.getUser()
    if (user == undefined || user.token == undefined || user.uid <= 0) {
      user = {
        'uid': 0,
        'nickname': '游客，请戳我登录',
        'avatar': '/assets/images/logo.png',
        'intro': '分享知识，共享智慧；知识，因分享，传承久远'
      }
    }
    that.setData({
      user: user,
    })
  },
  logout: function(e) {
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '您确定要退出登录吗？',
      success(res) {
        if (res.confirm) {
          util.request(config.api.logout) // 只需调用，不需要处理返回结果
          util.clearUser()
          util.toastSuccess('退出成功')
          that.initUser()
        }
      }
    })
  },
  userLoginEvent: function(e) {
    if (config.debug) console.log("userLoginEvent", e)
    if (this.data.user.uid == 0) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
  },
  onShareAppMessage: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  drawPoster: function() { //生成海报
    let that = this

    if (that.data.shareImage) {// 已经存在海报了就不再重新生成
      that.setData({
        showSharePoster: true
      })
      return
    }

    const sysInfo = wx.getSystemInfoSync()
    const posterWidth = sysInfo.windowWidth * 0.8
    const posterHeight = sysInfo.windowHeight * 0.8

    if (config.debug) console.log(sysInfo)

    let painting = {
      width: 320,
      height: 480,
      clear: true,
      views: [{
          type: 'image',
          url: '/assets/images/bg-poster.jpg',
          top: 0,
          left: 0,
          width: 320,
          height: 480
        },
        {
          type: 'text',
          content: '书中自有黄金屋，书中自有颜如玉',
          fontSize: 14,
          color: '#fff',
          textAlign: 'left',
          breakWord: true,
          top: 210,
          left: 15,
          bolder: false,
        },
        {
          type: 'text',
          content: '我决定向你推荐一款编程学习小程序',
          fontSize: 16,
          color: 'red',
          textAlign: 'left',
          top: 242,
          left: 15,
          bolder: true,
        },
        {
          type: 'text',
          content: 'By: 您的微信猿友【' + that.data.wechatUserInfo.nickName + '】',
          fontSize: 13,
          color: '#ddd',
          textAlign: 'left',
          top: 280,
          left: 15,
        },
        {
          type: 'image',
          url: '/assets/images/wxcode-black.png',
          top: 340,
          left: 120,
          width: 80,
          height: 80
        },
        {
          type: 'text',
          content: '长按识别小程序码',
          fontSize: 12,
          color: '#aaa',
          textAlign: 'left',
          top: 435,
          left: 110,
          lineHeight: 20,
          breakWord: true,
          width: 125
        }
      ]
    }
    that.setData({
      painting: painting,
      showSharePoster: true,
    })
  },
  showPoster(e) {
    if (config.debug) console.log(e)
    wx.hideLoading()
    const {
      tempFilePath,
      errMsg
    } = e.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath,
        showSharePoster: true,
      })
    } else {
      util.toastError(errMsg)
    }
  },
  closePoster() {
    this.setData({
      showSharePoster: false
    })
  },
  savePoster() {
    let that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImage,
      success(res) {
        util.toastSuccess('海报保存成功，接下来您可以把它分享到朋友圈了')
      },
      fail(e) {
        if (config.debug) console.log(e)
        wx.showModal({
          title: '温馨提示',
          content: '海报保存失败，您是否要通过预览图片的方式进行保存？长按即可保存哦.',
          success: function(res) {
            if (config.debug) console.log(res)
            if (res.confirm) {
              wx.previewImage({
                urls: [that.data.shareImage],
              })
              that.setData({
                showSharePoster: false
              })
            }
          }
        })

      }
    })
  }
})