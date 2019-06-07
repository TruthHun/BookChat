const config = require('../config.js')
const util = require('./util.js')

const keyCategories = 'categories';
const keyCategoriesExpire = 'categories-expire';
const categoriesExpire = 60; // 60 second

// 获取书籍分类
const getCategories = () => {
  if (config.debug) console.log(config.api.banners);
  // 从缓存中读取，判断缓存存不存在，并且有没有过期

  return new Promise((resolve, reject) =>{

  
    let categories = {};
    let now = util.now();
    let value
    let cacheExpire = parseInt(wx.getStorageSync(keyCategoriesExpire))

    if (cacheExpire > now) {
      try {
        value = wx.getStorageSync(keyCategories)
        if (value) value = JSON.parse(value)
      } catch (e) {
        console.log(e)
      }
    }
    
    if (value) {
      if (config.debug) console.log("从缓存中获取分类数据");
      resolve(value);
    } else {
      if (config.debug) console.log("从接口获取数据");
      util.request(config.api.categories).then(function (res) {
        wx.setStorageSync(keyCategories, JSON.stringify(res.data.categories))
        wx.setStorageSync(keyCategoriesExpire, now + categoriesExpire)
        resolve(res.data.categories)
      }).catch(function (e) {
        reject(e)
      })
    }
  });
}

// 获取书籍列表
const getBooks = (page, size, sort, cid, callback) => {
  wx.request({
    url: config.api.bookLists,
    data: {
      page,
      size,
      sort,
      cid
    },
    success: function(res) {
      if (res.data.data.books && res.data.data.books.length > 0) {
        callback(res.data.data.books, res.data.data.total)
      } else {
        callback([], 0)
      }
    }
  })
}

const getBooksByCids = (cids, page, size, sort, callback) => {
  wx.request({
    url: config.api.bookListsByCids,
    data: {
      page,
      size,
      sort,
      cids
    },
    success: function(res) {
      if (res.data.data.books) {
        callback(res.data.data.books)
      } else {
        callback({})
      }
    }
  })
}

const getBook = (identify, callback) => {
  let header = {
    'content-type': 'application/json'
  }
  if (util.getToken()) header["authorization"] = util.getToken()
  wx.request({
    url: config.api.bookInfo,
    header,
    data: {
      "identify": identify,
    },
    success: function(res) {
      if (res.statusCode == 404) {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
        return
      }
      if (res.data.data.book) {
        callback(res.data.data.book)
      } else {
        wx.redirectTo({
          url: '/pages/notfound/notfound',
        })
      }
    }
  })
}


const getRelatedBooks = (bookId, callback) => {
  wx.request({
    url: config.api.bookRelated,
    data: {
      "book_id": bookId,
    },
    success: function(res) {
      if (res.data.data.books) {
        callback(res.data.data.books)
      } else {
        callback([])
      }
    }
  })
}


const getCategoryByCid = (cid, callback) => {
  getCategories(function(categories, callback) {
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].cid == cid) {
        callback(categories[i])
        return
      }
    }
    callback({})
  })
}

module.exports = {
  getCategories,
  getBooks,
  getBook,
  getBooksByCids,
  getRelatedBooks,
  getCategoryByCid,
}