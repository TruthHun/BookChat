// api host，最后不要带斜杠
let host='https://www.bookstack.cn/bookchat';
// let host = 'http://localhost:8181/bookchat'

// 是否是调试模式。如果是生产环境，请设置为false
const debug = true

const api = {
  banners: `${host}/api/v1/banners`, 
  register: `${host}/api/v1/register`, 
  login: `${host}/api/v1/login`,
  logout: `${host}/api/v1/logout`,
  categories: `${host}/api/v1/book/categories`,
  bookLists: `${host}/api/v1/book/lists`,
  bookListsByCids: `${host}/api/v1/book/lists-by-cids`,
  bookInfo: `${host}/api/v1/book/info`,
  bookMenu: `${host}/api/v1/book/menu`,
  bookDownload: `${host}/api/v1/book/download`,
  searchBook: `${host}/api/v1/search/book`,
  searchDoc: `${host}/api/v1/search/doc`,
  bookmark: `${host}/api/v1/book/bookmark`,
  read: `${host}/api/v1/book/read`,
  userInfo: `${host}/api/v1/user/info`,
  userRelease: `${host}/api/v1/user/release`,
  userFans: `${host}/api/v1/user/fans`,
  userFollow: `${host}/api/v1/user/follow`,
  bookshelf: `${host}/api/v1/user/bookshelf`,
  comment: `${host}/api/v1/book/comment`,
  bookRelated: `${host}/api/v1/book/related`,
  changeAvatar: `${host}/api/v1/user/change-avatar`,
  changePassword: `${host}/api/v1/user/change-password`
}


module.exports = {
  api: api,
  debug:debug
}
