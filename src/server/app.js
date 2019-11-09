const koa = require('koa')
const path = require('path')
const db = require(path.resolve(__dirname, '../../bin/db/index.js'))
const app = new koa()
const router = require('koa-router')()
const {fork} = require('child_process')
// const util=require('util')
const schedule = require('node-schedule')

/**
 * 获取热门文章列表
 */
router.get('/getHotArticleList', async (ctx, next) => {
  const _data= db.get('hotResList') || {noData:true}
  ctx.body = { data:_data}
  await next()
})
// Todo 当脚本文件执行时间过长的时候 回调函数不会执行
// 轮询 获取从数据库获得数据 当长度大于指定的长度时返回结果
// function getSearchResultFromDb() {
//   let pollCount = 0
//   const pollInterval = 2000
//   const supposedMinSearchCount = searchConfig.minLength
//   const supposedMaxSearchCount = searchConfig.maxLength
//   return new Promise((resolve, reject) => {
//     const timer = setInterval(() => {
//       const data = db.get('searchResList').value()
//       if (pollCount < 10) {
//         console.log(pollCount, db.get('searchResList').value())
//         if (data.length >= supposedMaxSearchCount) {
//           console.log(data)
//           resolve(data)
//           clearInterval(timer)
//         } else {
//           pollCount++
//         }
//       } else {
//         if (data.length < supposedMinSearchCount) {
//           console.log('查找数据库超时')
//           clearInterval(timer)
//           reject()
//         } else {
//           resolve()
//         }
//       }
//     }, pollInterval)
//   })
// }
/**
 * 获取搜索文章结果列表
 */
router.get('/getSearchResultList', async (ctx, next) => {
  const { keywords } = ctx.query
  const child=fork('./bin/index.js',['s','@keywords',`_${keywords}`])
  const data=await new Promise ((resolve)=>{
    child.on('message',async m=>{
    console.log(m,'收到')
    const searchResult=db.get('searchResList').value()
    resolve(searchResult)
  })
})
const _data=data || {noData:true}
ctx.body = { data:_data}
  await next()
})
/**
 * 获取文章详情
 */
router.get('/getArticleDetail', async (ctx, next) => {
  const { id, type = 'hot' } = ctx.query
  let detail
  if (type === 'hot') {
    detail = db
      .get('hotArticleDetailList')
      .find({ id })
      .value()
  } else {
    detail = db
      .get('searchArticleDetailList')
      .find({ id })
      .value()
  }
  const _data=detail || {noData:true}
  ctx.body = {data:_data}
  await next()
})

// 跨域设置
app.use(async (ctx, next) => {
  ctx.response.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,PATCH'
  })
  await next()
})
app.use(router.routes()) // 启动路由
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log(3000)
})
// 周一 周四 周末8点更新
const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(4, 6)]
rule.hour = 8
rule.minute = 0
schedule.scheduleJob(rule, function() {
  process.exec('npm run node h')
  console.log(`更新时间:${new Date.getDay()}`)
})
