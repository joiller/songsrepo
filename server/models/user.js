import db from '../config/db'
import userModel from '../schema/user'
import Song from '../models/song'

const User = userModel(db,db.constructor)



const createUser = async function (data) {
  return await User.create({
    name: data.name,
    password: data.password,
    sex: data.sex||null
  })
}

const findUserAtLog = async function (data) {
  return  await User.findOne({
    where:{
      name: data.name,
      password: data.password
    }
  })
}

export default {
  User,
  createUser,
  findUserAtLog
}
