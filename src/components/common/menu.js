// components/common/menu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: {
      type: Object,
    },
    menu: {
      type: Array,
      value: []
    },
    bookmark: {
      type: Array
    },
    result: {
      type: Array
    },
    activeTab:{
      type:String,
      value: 'menu' // menu or bookmark
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pid: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabClick:function(e){
      if (e.target.dataset.tab != this.data.activeTab){
        this.triggerEvent('tabClick', e.target.dataset)
      }
    }
  }
})