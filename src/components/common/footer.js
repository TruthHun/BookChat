// components/common/footer.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Boolean,
      value: true,
    },
    hide: {
      type: Boolean,
      value: false,
    },
    tips: {
      type: String,
      value: '',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})