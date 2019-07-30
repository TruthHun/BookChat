//app.js
App({
  onLaunch: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '升级提示',
              content: '新版本已经为您准备就绪，是否升级应用？',
              success: function (res) {
                if (res.confirm)  updateManager.applyUpdate()
              }
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '您当前微信版本过低，为了您的用户体检，建议您升级到最新版微信'
      })
    }
  },
  globalData: {
    userInfo: null,
    bookshelfChanged: false,
    statusBarHeight: 0,
    titleBarHeight: 0
  },
  
})