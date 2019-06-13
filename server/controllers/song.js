import Song from '../models/song'

const getSongById = async function (ctx) {
  ctx.body = await Song.getSongById(ctx.params.id)
}
const getSongByTitle = async function (ctx) {
  ctx.body = await Song.getSongByTitle(ctx.params.title)
}
const getSongByUser = async function (ctx) {
  ctx.body = await Song.getSongByUser(ctx.params.user_id)
}

const getAllSongs = async function(ctx){
  ctx.body = await Song.getAllSongs()
}

module.exports = {
  getSongByUser,
  getSongByTitle,
  getSongById,
  getAllSongs
}
