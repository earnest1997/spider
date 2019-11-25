const koa = require('koa')
const path = require('path')
const { spiderDb, collectDb } = require(path.resolve(
  __dirname,
  '../../bin/db/index.js'
))
const app = new koa()
const router = require('koa-router')()
const { fork } = require('child_process')
const bodyParser = require('koa-bodyparser')
const schedule = require('node-schedule')

/**
 * 获取热门文章列表
 */
router.get('/getHotArticleList', async (ctx, next) => {
  const { startIndex, requestCount } = ctx.query
  const _data = {
    list: spiderDb.get('hotResList').slice(startIndex, requestCount),
    total: spiderDb
      .get('hotResList')
      .size()
      .value()
  } || {
    noData: true
  }
  ctx.body = { data: _data }
  await next()
})
// function getSearchResultFromspiderDb() {
//   let pollCount = 0
//   const pollInterval = 2000
//   const supposedMinSearchCount = searchConfig.minLength
//   const supposedMaxSearchCount = searchConfig.maxLength
//   return new Promise((resolve, reject) => {
//     const timer = setInterval(() => {
//       const data = spiderDb.get('searchResList').value()
//       if (pollCount < 10) {
//         console.log(pollCount, spiderDb.get('searchResList').value())
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
router.get('/getsearchList', async (ctx, next) => {
  const { keywords } = ctx.query
  const child = fork('./bin/index.js', ['s', '@keywords', `_${keywords}`])
  const data = await new Promise((resolve) => {
    child.on('message', async (m) => {
      console.log('search end')
      resolve(m)
    })
  })
  const _data = data || { noData: true }
  ctx.body = { data: _data }
  await next()
})
/**
 * 获取文章详情
 */
router.get('/getArticleDetail', async (ctx, next) => {
  const { id, type = 'hot' } = ctx.query
  let detail
  if (type === 'hot') {
    detail = spiderDb
      .get('hotArticleDetailList')
      .find({ id })
      .value()
  } else {
    detail = spiderDb
      .get('searchArticleDetailList')
      .find({ id })
      .value()
  }
  const _data = detail || { noData: true }
  ctx.body = { data: _data }
  await next()
})

/**
 * 添加到收藏夹
 */

router.post('/postCollect', async (ctx, next) => {
  // const
  console.log(ctx.request.body, 88)
  await next()
})
/**
 * 获取收藏夹列表
 */
router.get('/getCollects', async (ctx, next) => {
  const { user } = ctx.query
  const collects = collectDb
    .get(user)
    .value()
  ctx.body = { data: collects }
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
app.use(bodyParser())

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
