import Router from 'koa-router'
import User from '../controllers/user'

const router = Router()

router.post('/sign',async ctx=>{
  await User.createUser(ctx)
})

router.post('/',async ctx=>{
  await User.findUserAtLog(ctx)
})

export default router

