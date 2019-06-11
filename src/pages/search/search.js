const util = require('../../utils/util.js')
const config = require('../../config.js')

Page({
  data: {
    lists: [],
    wd: '',
    focus: false,
    tabs: [{
        title: "书籍",
        value: "book"
      },
      {
        title: "文档",
        value: "doc"
      }
    ]
  },
  onLoad: function(options) {
    let wd = options.wd || ''
    if (wd == '') {
      this.setData({
        focus: true
      })
      return
    }

    this.setData({wd:wd})

  }

})