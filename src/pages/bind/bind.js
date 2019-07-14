const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    bindNew: false,
    loading: false,
    redirect: '',
    code: '',
    nickname: '',
    show: false,
  },
  onLoad: function(options) {
    let user = getApp().globalData.wechatUser

    if (config.debug) console.log(user, options)

    if (user == undefined) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }

    this.setData({
      redirect: options.redirect || encodeURIComponent('/pages/me/me'),
      code: options.code || '',
      nickname: user.userInfo.nickName || '',
      show: true,
    })
    wx.setNavigationBarTitle({
      title: '绑定账号',
    })
  },
  changeTab: function(e) {
    if (config.debug) console.log("changeTab", e)
    e.currentTarget.dataset.bind == "old" ? this.setData({
      bindNew: false
    }) : this.setData({
      bindNew: true
    })
  },
  formSubmit: function(e) {
    if (config.debug) console.log("formSubmit", e);

    if (this.data.loading) return;
    this.setData({
      loading: true
    })

    let that = this
    let user = getApp().globalData.wechatUser
    let form = e.detail.value
    form.iv = user.iv
    form.encryptedData = user.encryptedData
    form.code = that.data.code

    if (config.debug) console.log("form data", form);

    util.request(config.api.wechatLoginBind, form, 'POST').then(function(res) {
      if (config.debug) console.log(config.api.wechatLoginBind, res)
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    })

    that.setData({
      loading: false
    })


  },
})