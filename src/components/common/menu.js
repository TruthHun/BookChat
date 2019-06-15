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
    bookmarks: {
      type: Array
    },
    result: {
      type: Array
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
    
  }

})