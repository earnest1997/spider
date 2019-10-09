const koa=require('koa')
const path = require('path')
const db=require(path.resolve(__dirname,'../../bin/db.js'))
const app = new koa()
const router=require('koa-router')()
const process=require('child_process')


router.get('/hotArticlesList',async(ctx,next)=>{
ctx.body={hotArticlesList:db.get('searchResList')}
await next()
})

router.get('/searchResultList',async (ctx,next)=>{
  const {keywords}=ctx.query
  console.log(ctx.query,'jihhh',keywords)
  process.execSync(`npm run node s @keywords _${keywords}`)
  console.log(db.get('searchResult'),'huggg')
  ctx.body={searchResultList:db.get('searchResult')}
  await next()
})
router.get('/getArticleDetail',async(ctx,next)=>{
  const {id} = ctx.query
  const detail = db.get('articleDetail').find({id}).value()
  console.log(detail,'detail',id)
  const {content}=detail
  ctx.body={articleDetail:content}
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