const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path=require('path')

const adapterSpider = new FileSync(path.resolve(__dirname,'./data/spider.json'))
const adapterUser = new FileSync(path.resolve(__dirname,'./data/user.json'))
const adapterCollect =new FileSync(path.resolve(__dirname,'./data/collect.json'))

const spiderDb = low(adapterSpider)
const userDb=low(adapterUser)
const collectDb=low(adapterCollect)

spiderDb._.mixin({
  slice:function(arr,index,length){
    const end=+index+(+length)
   return arr.slice(index,end)
  }
})
spiderDb.defaults({
  searchResList: [],
  hotArticleDetailList: [],
  searchArticleDetailList: [],
  hotResList: []
}).write()

userDb.defaults({
  username:'ashley',
  password:123
})



module.exports = {spiderDb,userDb,collectDb}
