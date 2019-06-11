const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:false
  },
  onShow:function(){
    let token = util.getToken()
    if(token){
      wx.switchTab({
        url: '/pages/me/me',
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
      url: '/pages/reg/reg',
    })
  },
  formSubmit: function(e) {
    if (config.debug) console.log("formSubmit", e);

    if (this.data.loading) return;

    if (e.detail.value.password == '' || e.detail.value.username == '') {
      util.toastError('账号和密码均不能为空')
      return
    }

    this.setData({loading:true})

    util.request(config.api.login, e.detail.value, 'POST').then((res) => {
      if (config.debug) console.log(config.api.login, res);

      let user = res.data.user
      if (user == undefined || user.uid <= 0 || user.token == '') {
        util.toastError('登录失败：未知错误')
        this.setData({ loading: false })
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
      if (config.debug) console.log(err);
      this.setData({ loading: false })
      if (err.data) {
        util.toastError(err.data.message)
      } else {
        util.toastError(err.errMsg)
      }
    })
  }
})