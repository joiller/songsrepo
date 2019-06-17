import db from '../config/db'
import songModel from '../schema/song'

const Song = songModel(db,db.constructor)

const getSongById = async function (id) {
  return await Song.findOne({
    where: {
      id:id
    }
  })
}

const getSongByTitle = async function (title) {
  return await Song.findOne({
    where: {
      title: title
    }
  })
}

const getAllSongs = async function(){
  return await Song.findAll()
}



// Song.create({
//   title: '方圆几里',
//   singer: '薛之谦',
//   url: 'static/audio/薛之谦 - 方圆几里.mp3',
//   isVip: true
// })

// Song.update({
//   url: 'static/audio/薛之谦 - 其实.mp3'
// },{
//   where:{
//     title: '其实'
//   }
// })


// db.sync()
module.exports = {
  Song,
  getSongById,
  getSongByTitle,
  getAllSongs
}
