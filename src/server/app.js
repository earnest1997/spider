const koa=require('koa')
const path = require('path')
const db=require(path.resolve(__dirname,'../../bin/db.js'))
const app = new koa()
const router=require('koa-router')()
const process=require('child_process')
const util=require('util')


/**
 * 获取热门文章列表
 */
router.get('/getHotArticleList',async(ctx,next)=>{
ctx.body={hotArticleList:db.get('hotResList')}
await next()
})
/**
 * 获取搜索文章结果列表
 */
router.get('/getSearchResultList',async (ctx,next)=>{
  const {keywords}=ctx.query
  console.log('ddd',Date.now())
  const child=process.exec(`npm run node s @keywords _${keywords}`)
  await util.promisify(child)
  console.log(88877,Date.now())
  ctx.body={searchResultList:db.get('searchResList')}
  await next()
})
/**
 * 获取文章详情
 */
router.get('/getArticleDetail',async(ctx,next)=>{
  const {id,type='hot'} = ctx.query
  let detail
  if(type === 'hot'){
   detail = db.get('hotArticleDetailList').find({id}).value()
  }
  else{
    detail=db.get('searchArticleDetailList').find({id}).value()
  }
  ctx.body=detail
  await next()
})
/**
 * 获取搜索文章详情
 */
// router.get('/getSearchArticleDetail',async(ctx,next)=>{
//   const {id} = ctx.query
//   const detail = db.get('searchArticleDetailList').find({id}).value()
//   ctx.body={...detail}
//   await next()
// })
// 跨域设置
app.use(async(ctx,next)=>{
  ctx.response.set({
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'GET,POST,DELETE,PATCH'
  })
  await next()
})
app.use(router.routes()) // 启动路由
app.use(router.allowedMethods())

app.listen(3000,()=>{
  console.log(3000)
})