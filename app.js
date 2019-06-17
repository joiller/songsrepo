import Koa from "koa"
import parser from 'koa-bodyparser'
import Router from 'koa-router'
import login from './server/routes/login'
import index from './server/routes/index'
import serve from 'koa-static'
import path from 'path'
import historyApiFallback from 'koa2-history-api-fallback'

const app = new Koa()
const router = Router()
app.use(parser())

app.use(async (ctx,next)=>{
  // const start = Date.now()
  await next()
  // console.log(`${ctx.request.method} ${ctx.request.url} ${Date.now()-start+'ms'}`)
})

router.use('/index',index.routes())
router.use('/login',login.routes())
app.use(router.routes())
app.use(historyApiFallback())
app.use(serve(path.resolve('dist'),{
  setHeaders:function (res,path,stats) {
    if (/\\static\\audio/.test(path))  {
      // console.log('matched')
      res.setHeader('Accept-Ranges', 'bytes')
    }
  }
}))

app.on('error',function (err) {})

app.listen(80,'0.0.0.0')

console.log(`app is running at 3000`)
