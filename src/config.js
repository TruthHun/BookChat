let host='https://www.bookstack.cn';
const api = {
  getBanner:`${host}/api/v1/get-banner`,
  getCate: `${host}/api/v1/get-cate`,
  getBooks: `${host}/api/v1/get-books`,
  getBookInfo: `${host}/api/v1/get-book-info`,
  getBookMenu: `${host}/api/v1/get-book-menu`,
  getBookContent: `${host}/api/v1/get-book-content`,
  getBookmark: `${host}/api/v1/get-bookmark`,
  login: `${host}/api/v1/login`,
  reg: `${host}/api/v1/reg`,
}
const debug=true

module.exports = {
  api: api,
  debug:debug
}
