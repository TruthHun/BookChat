//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    books: [],
    wd: '',
    focus: false,
  },
  onLoad: function(options) {
    let wd = options.wd || ''
    if (wd == '') {
      this.setData({
        focus: true
      })
    }
  }
})