// components/common/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wd: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: 'Search...'
    },
    focus: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    wd: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    search: function(e) {
      if (config.debug) console.log("search event", e)
      if (e.detail.value != '') {
        wx.navigateTo({
          url: '/pages/search/search?wd=' + e.detail.value,
        })
      }
    },
    formSubmit: function(e) {
      if (this.data.wd != '') {
        wx.navigateTo({
          url: '/pages/search/search?wd=' + this.data.wd,
        })
      }
    },
    changeValue: function(e) {
      this.setData({
        wd: e.detail.value
      })
    }
  }
})