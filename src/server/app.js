const koa=require('src/server/koa')
const {db}=require('../../bin/index.js')
const app = new koa()
const router=require('src/server/koa-router')()
const process=require('child_process')


router.get('/hotArticleList',async(ctx,next)=>{
ctx.body=db.get('hotArticleList')
await next()
})

router.get('/searchResult',async (ctx,next)=>{
  ctx
})

app.use(router.routes()) // 启动路由
app.use(router.allowedMethods())

app.listen(3000,()=>{
  console.log(3000)
})