import db from '../config/db'
import user_song from '../schema/user_song'
import Song from '../models/song'
import User from '../models/user'

const UserSong = user_song(db,db.constructor)

// User.User.belongsToMany(Song.Song,{
//   through:{
//     model:UserSong,
//     unique:false,
//     scope:{
//       user_id:'id'
//     }
//   },
//   foreignKey:'id',
//   constraints: false,
//   scope:{
//     user_id:'id'
//   }
// })
//
// Song.Song.belongsToMany(User.User,{
//   through:{
//     model:UserSong,
//     unique:false,
//     scope:{
//       song_id:'id'
//     }
//   },
//   foreignKey:'id',
//   constraints:false,
//   scope:{
//     song_id:'id'
//   }
// })

User.User.belongsToMany(Song.Song,{
  through:UserSong,
  foreignKey:'user_id',
  // otherKey:'song_id'
})

Song.Song.belongsToMany(User.User,{
  through:UserSong,
  foreignKey:'song_id'
})

// db.sync({force:true})

const addSong = async function (data) {
  console.log(data)
  return await UserSong.create({
    song_id: data.song_id,
    user_id: data.user_id
  })
}

const getMySong = async function (data) {
  // const dt = await User.User.findAll({
  //   include:[
  //     {
  //       model: Song.Song,
  //       where:{
  //         id:1
  //       }
  //     }
  //   ]
  // })

  // const dt = await Song.Song.findAll({
  //   include:[
  //     {
  //       model:User.User,
  //       through:{
  //         where:{
  //           id:data.user_id
  //         }
  //       }
  //     }
  //   ]
  // })
    return await await Song.Song.findAll({
    include: [{
      model: User.User,
      // through: {
        // attributes: ['createdAt', 'startedAt', 'finishedAt'],
        // where: {user_id:1}
      // },
      where:{
        id:data.user_id
      }
    }]
  });
}

const deleteSong = async function (data) {
  return await UserSong.destroy({
    where: {
      user_id: data.user_id,
      song_id: data.song_id
    }
  })
}




export default {
  addSong,
  getMySong,
  deleteSong
}
