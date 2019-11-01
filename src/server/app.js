const koa = require('koa')
const path = require('path')
const db = require(path.resolve(__dirname, '../../bin/db.js'))
const app = new koa()
const router = require('koa-router')()
const process = require('child_process')
// const util=require('util')
const schedule = require('node-schedule')
const { searchConfig } = require(path.resolve(
  __dirname,
  '../../bin/config/searchConfig.js'
))

/**
 * 获取热门文章列表
 */
router.get('/getHotArticleList', async (ctx, next) => {
  ctx.body = { hotArticleList: db.get('hotResList') }
  await next()
})
// Todo 当脚本文件执行时间过长的时候 回调函数不会执行
// 轮询 获取从数据库获得数据 当长度大于指定的长度时返回结果
function getSearchResultFromDb() {
  let pollCount = 0
  const pollInterval = 2000
  const supposedMinSearchCount = searchConfig.minLength
  const supposedMaxSearchCount = searchConfig.maxLength
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      const data = db.get('searchResList').value()
      if (pollCount < 10) {
        console.log(pollCount, db.get('searchResList').value())
        if (data.length >= supposedMaxSearchCount) {
          console.log(data)
          resolve(data)
          clearInterval(timer)
        } else {
          pollCount++
        }
      } else {
        if (data.length < supposedMinSearchCount) {
          console.log('查找数据库超时')
          clearInterval(timer)
          reject()
        } else {
          resolve()
        }
      }
    }, pollInterval)
  })
}
/**
 * 获取搜索文章结果列表
 */
router.get('/getSearchResultList', async (ctx, next) => {
  const { keywords } = ctx.query
  process.exec(`node './bin/index.js' s @keywords _${keywords}`)
  const searchResult = await getSearchResultFromDb()
  console.log(88877, Date.now())
  ctx.body = { searchResultList: searchResult }
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
  ctx.body = detail
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
