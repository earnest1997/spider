const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const adapters = new FileSync(path.resolve(__dirname, './db.json'))
const db = low(adapters)
db.defaults({
  searchResList: [],
  hotArticleDetailList: [],
  searchArticleDetailList: [],
  hotResList: []
}).write()

module.exports = db
