import Koa from "koa"
import parser from 'koa-bodyparser'
import Router from 'koa-router'
import login from './server/routes/login'
import index from './server/routes/index'

const app = new Koa()
const router = Router()
app.use(parser())

app.use(async (ctx,next)=>{
  const start = Date.now()
  await next()
  console.log(Date.now()-start+'ms')
})

router.use('/index',index.routes())
router.use('/login',login.routes())
app.use(router.routes())

app.listen(3000)

console.log(`app is running at 3000`)
