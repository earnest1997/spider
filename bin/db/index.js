const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const adapters = new FileSync(path.resolve(__dirname, './db.json'))
const db = low(adapters)
db._.mixin({
  slice:function(arr,index,length){
    const end=+index+(+length)
   return arr.slice(index,end)
  }
})
db.defaults({
  searchResList: [],
  hotArticleDetailList: [],
  searchArticleDetailList: [],
  hotResList: []
}).write()

module.exports = db
