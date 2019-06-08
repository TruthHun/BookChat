const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onUnload: function () {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  wechatLogin: function() {
    wx.showModal({
      title: '温馨提示',
      content: 'BookChat暂未开通微信授权登录，敬请期待',
    })
  },
  toRegister: function() {
    wx.navigateTo({
      url: '/pages/reg/reg',
    })
  },
  formSubmit: function(e) {
    if (config.debug) console.log("formSubmit", e);

    if (e.detail.value.password == '' || e.detail.value.username == '') {
      util.toastError('账号和密码均不能为空')
      return
    }

    util.loading('正在登录中...')

    util.request(config.api.login, e.detail.value, 'POST').then((res) => {
      if (config.debug) console.log(config.api.login, res);

      wx.hideLoading()

      let user = res.data.user
      if (user == undefined || user.uid <= 0 || user.token == '') {
        util.toastError('登录失败：未知错误')
        return
      }

      util.setUser(user)

      util.toastSuccess('登录成功')

      setTimeout(function() {
        wx.switchTab({
          url: '/pages/me/me',
        })
      }, 1500)

    }).catch((err) => {
      wx.hideLoading()
      if (err.data) {
        util.toastError(err.data.message)
      } else {
        util.toastError(err.errMsg)
      }
    })
  }
})