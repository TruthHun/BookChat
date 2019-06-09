//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    books: [{
      book_name: "书名",
      book_id: 1,
      view: 10,
      created_at: '',
      description: '这是摘要',
      cnt_doc: 10,
      cover: "https://static.bookstack.cn/projects/flutter-study/uploads/201906/15a611f3c1343805.jpg/cover",
    }, {
      book_name: "书名2",
      book_id: 2,
      view: 10,
      created_at: '',
      description: '这是摘要2',
      cnt_doc: 10,
      cover: "https://static.bookstack.cn/projects/flutter-study/uploads/201906/15a611f3c1343805.jpg/cover",
    }]
  },
  onLoad: function() {

  }
})