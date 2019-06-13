import Router from 'koa-router'
import Song from '../controllers/song'
import UserSong from '../controllers/user_song'

const router = Router()

router.post('/getAllSongs',async ctx=>{
  await Song.getAllSongs(ctx)
})

router.post('/addSong',async ctx=>{
  await UserSong.addSong(ctx)
})

router.post('/getMySong',async ctx=>{
  await UserSong.getMySong(ctx)
})

router.post('/deleteSong',async ctx=>{
  await UserSong.deleteSong(ctx)
})

export default router
