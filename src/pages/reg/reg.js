const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    email: '',
    username: '',
    nickname: '',
    password: '',
    re_password: '',
    redirect: encodeURIComponent('/pages/me/me')
  },
  onLoad: function(option) {
    if (config.debug) console.log(option)
    if (option.redirect) {
      this.setData({
        redirect: option.redirect
      })
    }
  },
  toLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login?redirect=' + this.data.redirect,
    })
  },
  wechatLogin: function() {
    wx.showModal({
      title: '温馨提示',
      content: 'BookChat暂未开通微信授权登录，敬请期待',
    })
  },
  input: function(e) {
    if (config.debug) console.log(e)

    let value = e.detail.value.trim()
    let name = e.target.dataset.name

    switch (name) {
      case 'username':
        this.setData({
          username: value
        })
        break;
      case 'password':
        this.setData({
          password: value
        })
        break;
      case 'nickname':
        this.setData({
          nickname: value
        })
        break;
      case 're_password':
        this.setData({
          re_password: value
        })
        break;
      case 'email':
        this.setData({
          email: value
        })
        break;
    }
  },
  submit: function(e) {
    if (config.debug) console.log(this.data)
    let that = this

    if (that.data.loading) return

    if (!util.isEmail(that.data.email)) {
      util.toastError('邮箱格式不正确')
      return
    }
    if (that.data.password != that.data.re_password) {
      util.toastError('两次输入的密码不一致，请重新输入')
      return
    }

    if (that.data.username == '' || that.data.nickname == '' || that.data.password == '' || that.data.re_password == '') {
      util.toastError('以上资料项均为必填项，请认真填写')
      return
    }

    util.loading('正在注册中...')
    that.setData({
      loading: true
    })
    util.request(config.api.register, that.data, 'POST').then(function(res) {
      if (config.debug) console.log(config.api.register, res)
      util.setUser(res.data.user)
      wx.showToast({
        title: '注册成功',
      })
      setTimeout(function() {
        util.redirect(decodeURIComponent(that.data.redirect))
      }, 1500)
    }).catch(function(e) {
      if (config.debug) console.log(config.api.register, e)
      util.toastError(e.data.message || e.errMsg)
    }).finally(function() {
      that.setData({
        loading: false
      })
    })
  }
})