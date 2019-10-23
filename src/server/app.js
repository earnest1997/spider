const koa=require('koa')
const path = require('path')
const db=require(path.resolve(__dirname,'../../bin/db.js'))
const app = new koa()
const router=require('koa-router')()
const process=require('child_process')


router.get('/hotArticlesList',async(ctx,next)=>{
ctx.body={hotArticlesList:db.get('hotResList')}
await next()
})

router.get('/searchResultList',async (ctx,next)=>{
  const {keywords}=ctx.query
  process.execSync(`npm run node s @keywords _${keywords}`)
  ctx.body={searchResultList:db.get('searchResult')}
  await next()
})
router.get('/getArticleDetail',async(ctx,next)=>{
  const {id} = ctx.query
  const detail = db.get('articleDetail').find({id}).value()
  ctx.body={...detail}
  await next()
})
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