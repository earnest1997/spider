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

router.get('/searchResult',async (ctx,next)=>{
  ctx.body="huuu"
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