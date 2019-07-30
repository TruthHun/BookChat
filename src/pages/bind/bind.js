const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    bindNew: false,
    loading: false,
    redirect: '',
    sess: '',
    nickname: '',
    show: false,
    title:'绑定账号'
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
      sess: decodeURIComponent(options.sess) || '',
      nickname: user.userInfo.nickName || '',
      avatar: user.userInfo.avatarUrl || '/assets/images/logo.png',
      show: true,
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
    form.sess = that.data.sess
    if (config.debug) console.log("form data", form);
    util.request(config.api.loginBindWechat, form, 'POST').then(function(res) {
      if (config.debug) console.log(config.api.wechatLoginBind, res)
      if (res.data && res.data.user){
        util.setUser(res.data.user)
        util.toastSuccess('登录成功')
        setTimeout(function () {
          util.redirect(decodeURIComponent(that.data.redirect))
        }, 1500)
      }else{
        util.toastError('数据解析不正确')
      }
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    }).finally(function(){
      that.setData({
        loading: false
      })
    })
  },
})