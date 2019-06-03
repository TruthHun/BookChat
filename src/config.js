let host='https://www.bookstack.cn/bookchat';

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
  userRelease: `${host}/api/v1/user/release`,
  userFans: `${host}/api/v1/user/fans`,
  userFollow: `${host}/api/v1/user/follow`,
  bookshelf: `${host}/api/v1/user/bookshelf`,
  comment: `${host}/api/v1/book/comment`,
  bookRelated: `${host}/api/v1/book/related`,
  changeAvatar: `${host}/api/v1/user/change-avatar`,
  changePassword: `${host}/api/v1/user/change-password`
}

const debug=true

module.exports = {
  api: api,
  debug:debug
}
