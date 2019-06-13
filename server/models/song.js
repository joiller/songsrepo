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
//   title: '一半',
//   singer: '薛之谦',
//   url: 'src/assets/songs/yiban.mp3'
// })
// Song.create({
//   title: '下雨了',
//   singer: '薛之谦',
//   url: 'src/assets/songs/薛之谦 - 下雨了.mp3'
// })
// Song.create({
//   title: '其实',
//   singer: '薛之谦',
//   url: 'src/assets/songs/薛之谦 - 其实.mp3'
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
