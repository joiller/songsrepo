import UserSong from '../models/user_song'
import Song from '../models/song'

const addSong = async function (ctx) {
  const added = await UserSong.addSong(ctx.request.body)
  if (added) {
    ctx.body = {
      success:true,
      added: added
    }
  }
}

const getMySong = async function (ctx) {
  ctx.body = await UserSong.getMySong(ctx.request.body)
}

const deleteSong = async function (ctx) {
  ctx.body = await UserSong.deleteSong(ctx.request.body)
}

export default {
  addSong,
  getMySong,
  deleteSong
}
