const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    loading: false,
    about: config.about,
    redirect: encodeURIComponent('/pages/me/me'),
  },
  onLoad: function(option) {
    if (config.debug) console.log(option)
    if (option.redirect) {
      this.setData({
        redirect: option.redirect,
      })
    }
  },
  onShow: function() {
    let token = util.getToken()
    if (token) {
      wx.switchTab({
        url: decodeURIComponent(this.data.redirect),
      })
    }
    return
  },
  wechatLogin: function() {
    wx.showModal({
      title: '温馨提示',
      content: 'BookChat暂未开通微信授权登录，敬请期待',
    })
  },
  toRegister: function() {
    wx.navigateTo({
      url: '/pages/reg/reg?redirect=' + this.data.redirect,
    })
  },
  formSubmit: function(e) {
    if (config.debug) console.log("formSubmit", e);

    if (this.data.loading) return;

    if (e.detail.value.password == '' || e.detail.value.username == '') {
      util.toastError('账号和密码均不能为空')
      return
    }

    this.setData({
      loading: true
    })

    let that = this

    util.request(config.api.login, e.detail.value, 'POST').then((res) => {
      if (config.debug) console.log(config.api.login, res);
      let user = res.data.user
      if (user == undefined || user.uid <= 0 || user.token == '') {
        util.toastError('登录失败：未知错误')
        that.setData({
          loading: false
        })
        return
      }
      util.setUser(user)
      util.toastSuccess('登录成功')
      setTimeout(function() {
        util.redirect(decodeURIComponent(that.data.redirect))
      }, 1500)
    }).catch((e) => {
      if (config.debug) console.log(e);
      that.setData({
        loading: false
      })
      util.toastError(e.data.message || e.errMsg)
    })
  },
  findPassword: function(e) {
    wx.showModal({
      title: '温馨提示',
      content: '目前BookChat小程序暂不支持找回密码的功能，如果忘记了密码，请打开书栈网(https://www.bookstack.cn)将密码找回',
    })
  },
  wechatLogin: function(e) {
    let that = this
    getApp().globalData.wechatUser=e.detail
    wx.login({
      success(res) {
        if (config.debug) console.log("微信登录", res)
        if (res.code) {
          util.request(config.api.wechatLogin, { code: res.code }, 'POST').then(function (res) {
            // 登录成功
            let user = res.data.user
            if (user == undefined || user.uid <= 0 || user.token == '') {
              util.toastError('登录失败：未知错误')
              that.setData({
                loading: false
              })
              return
            }
            util.setUser(user)
            util.toastSuccess('登录成功')
            setTimeout(function () {
              util.redirect(decodeURIComponent(that.data.redirect))
            }, 1500)
          }).catch(function(e){
            // 如果是 401，则跳转到信息绑定页面，否则直接提示相关错误信息
            console.log(e)
            wx.navigateTo({
              url: '/pages/bind/bind?redirect='+that.data.redirect+"&code="+res.code,
            })
          })
        } else {
          util.toastError('登录失败！' + res.errMsg)
        }
      },
      fail: function(e) {
        util.toastError(e.errMsg)
      }
    })
  }
})