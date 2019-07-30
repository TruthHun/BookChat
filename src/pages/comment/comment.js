const config = require('../../config.js')
const util = require('../../utils/util.js')

Page({
  data: {
    beforeScore: 0,
    score: 0,
    identify: 0,
    content: '',
    messages: ['期待您的打分', '惨不忍睹', '太差了', '一般般', '还不错', '非常棒'],
    loading: false,
    title:'点评'
  },
  onLoad: function(options) {
    if (config.debug) console.log(options)

    let score = options.score || 0
    let identify = options.identify || ''

    if (!identify) {
      wx.redirectTo({
        url: '/page/notfound/notfound',
      })
      return
    }
    this.setData({
      score: score,
      beforeScore: score,
      identify: identify
    })
  },
  touchStar: function(e) {
    let that = this
    if (that.data.beforeScore > 0) {
      util.toastError("您之前已给过评分啦")
    } else {
      that.setData({
        score: e.currentTarget.dataset.score
      })
    }
  },
  inputComment: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit: function() {
    wx.hideLoading()
    let that = this

    if (that.data.loading) return

    if (that.data.score == 0) {
      util.toastError('忘了打个分？')
      return
    }
    if (that.data.content.length < 5 || that.data.content.length > 256) {
      util.toastError('点评内容需要 5 ~ 256 个字符')
      return
    }

    that.setData({
      loading: true
    })

    util.request(config.api.comment, {
      content: that.data.content,
      identify: that.data.identify,
      score: that.data.score
    }, 'POST').then(function(res) {
      if (config.debug) console.log(config.api.comment, res)
      wx.showToast({
        title: '发表点评成功',
      })
      setTimeout(function(){
        wx.navigateBack({
          delta: 1,
        })
      },1000)
    }).catch(function(e) {
      util.toastError(e.data.message || e.errMsg)
    }).finally(function() {
      that.setData({
        loading: false
      })
    })


  }
})