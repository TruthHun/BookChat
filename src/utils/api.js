const config = require('../config.js')
const util = require('./util.js')

const keyCategories = 'categories';
const keyCategoriesExpire = 'categories-expire';
const categoriesExpire = 60; // 60 second

// 获取书籍分类
const getCategories = () => {
  if (config.debug) console.log(config.api.banners);
  // 从缓存中读取，判断缓存存不存在，并且有没有过期

  return new Promise((resolve, reject) => {


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
      util.request(config.api.categories).then(function(res) {
        wx.setStorageSync(keyCategories, JSON.stringify(res.data.categories))
        wx.setStorageSync(keyCategoriesExpire, now + categoriesExpire)
        resolve(res.data.categories)
      }).catch(function(e) {
        reject(e)
      })
    }
  });
}

const getCategoryByCid = (cid) => {
  return getCategories().then((categories) => {
    let found = false
    let category = {}
    for (let i = 0; found == false && i < categories.length; i++) {
      if (cid == categories[i].id) {
        found = true
        category= categories[i]
      }
    }
    return category
  })
}

module.exports = {
  getCategories,
  getCategoryByCid,
}