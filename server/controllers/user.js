import User from '../models/user'
import jwt from 'jsonwebtoken'

const createUser = async function (ctx) {
  const created = await User.createUser(ctx.request.body)
  if (created) {
    ctx.body = {
      success: true,
      created: created
    }
  }
}

const findUserAtLog = async function (ctx) {
  const user = await User.findUserAtLog(ctx.request.body)
  if (user) {
    const userToken = user.dataValues
    console.log(userToken)
    const secretKey = 'user_log_key'
    const token = jwt.sign(userToken,secretKey)

    ctx.body = {
      success: true,
      token: token
    }
  }
}


export default {
  createUser,
  findUserAtLog
}
