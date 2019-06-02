const config = require('../config.js')
const util = require('./util.js')

// 获取横幅
const getBanners = (callback) => {
  wx.request({
    url: config.api.banners,
    data: {},
    success(res) {
      callback(res)
    }
  })
}

// 获取书籍分类
const getCategories = (callback) => {
  // 从缓存中读取，判断缓存存不存在，并且有没有过期
  let expire = 60; // 60 second
  let categories = {};
  let keyCategories = 'categories';
  let keyCategoriesExpire = 'categories-expire';
  let now = util.now();

  let cacheExpire = parseInt(wx.getStorageSync(keyCategoriesExpire))
  if (cacheExpire > now) {
    if (config.debug) console.log("从缓存中获取分类数据");
    try {
      let value = wx.getStorageSync(keyCategories)
      if (value) {
        callback(JSON.parse(value))
        return
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (config.debug) console.log("从接口中获取分类数据");
  wx.request({
    url: config.api.categories,
    data: {},
    success(res) {
      wx.setStorageSync(keyCategories, JSON.stringify(res.data.data.categories))
      wx.setStorageSync(keyCategoriesExpire, now + expire)
      callback(res.data.data.categories)
    }
  })
}

module.exports = {
  getBanners: getBanners,
  getCategories: getCategories,
}