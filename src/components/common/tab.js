// components/common/tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    }
    // value's struct like this ==> {title:"tab title", value:"tab value",class:"tab class if needed"}
  },

  /**
   * 组件的初始数据
   */
  data: {
    activeValue: '',
    gridLen: 12, //1 ~ 12
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick: function(e) {
      this.setData({
        activeValue: e.target.dataset.value
      })
      this.triggerEvent('click', e.target.dataset)
    }
  },
  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    if (this.data.tabs.length > 0) {
      this.setData({
        activeValue: this.data.tabs[0].value
      })
    }
  }
})