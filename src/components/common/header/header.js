const app = getApp();
Component({
  properties: {
    title: {
      type: String,
      value: 'BookChat'
    },
    showIcon: {
      type: Boolean,
      value: false,
    }
  },

  data: {
    statusBarHeight: 0,
    titleBarHeight: 0,
    currentPagesLength:0,
  },

  ready: function() {
    this.setData({
      currentPagesLength:getCurrentPages().length
    })
    if (app.globalData && app.globalData.statusBarHeight && app.globalData.titleBarHeight) {
      this.setData({
        statusBarHeight: app.globalData.statusBarHeight,
        titleBarHeight: app.globalData.titleBarHeight
      });
    } else {
      let that = this
      wx.getSystemInfo({
        success: function(res) {
          if (!app.globalData) {
            app.globalData = {}
          }
          if (res.model.indexOf('iPhone') !== -1) {
            app.globalData.titleBarHeight = 44
          } else {
            app.globalData.titleBarHeight = 48
          }
          app.globalData.statusBarHeight = res.statusBarHeight
          that.setData({
            statusBarHeight: app.globalData.statusBarHeight,
            titleBarHeight: app.globalData.titleBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    }
  },

  methods: {
    headerBack() {
      wx.navigateBack({
        delta: 1,
        fail(e) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    },
    headerHome() {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})