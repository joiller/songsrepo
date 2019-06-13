<template>
    <div class="all-songs" ref="temp">
      <div v-if="user">
        欢迎你，{{user.name}}
        <button v-on:click="logout">注销</button>
      </div>
      <div v-else>
        <a href="/#/login">登录</a>
      </div>
      <div class="nav-container" v-if="user">
        <button class="nav-btn" v-on:click="toggleMySong" v-if="allSongs">我的主页</button>
        <button class="nav-btn" v-on:click="toggleMySong" v-else>首页歌单</button>
      </div>
      <div class="grid-title title" v-bind:class="user_exist">
        <span>歌名</span>
        <span>歌手</span>
        <span v-if="user">操作</span>
      </div>
      <div class="grid-container" v-if="allSongs">
        <div v-for="song in songs" class="grid-show"  v-bind:class="user_exist">
          <span>{{song.title}}</span>
          <span>{{song.singer}}</span>
          <div v-if="user">
            <audio controls v-bind:src="song.url">Your browser does not support the</audio>
            <button v-on:click="play(song.url)">播放</button>
            <button v-on:click="addSong(song.id)">添加入歌单</button>
          </div>
        </div>
      </div>
      <div v-else class="grid-container">
        <div v-for="song in mysongs" class="grid-show"  v-bind:class="user_exist">
          <span>{{song.title}}</span>
          <span>{{song.singer}}</span>
          <div v-if="user">
            <button v-on:click="deleteSong(song.id)">从歌单删除</button>
          </div>
        </div>
      </div>
      <div class="player">
        <div class="base-control">
          <ion-icon name="skip-backward"></ion-icon>
          <ion-icon name="skip-forward"></ion-icon>
        </div>
        <div class="jdt">
          <ion-icon class="pin" name="happy"></ion-icon>
        </div>
        <audio src="/static/audio/yiban.mp3"></audio>
        <button v-on:click="showSong">显示</button>
      </div>
    </div>
</template>

<script>
  import jwt from 'jsonwebtoken'

  export default {
        name: "index",
      data(){
          return {
            user_exist:'',
            user:{},
            songs:[],
            mysongs:[],
            allSongs:true
          }
      },
      methods:{
        getUser(){
          this.user = jwt.decode(sessionStorage.getItem('user_info'))
          if (this.user) {
            this.user_exist = 'exist'
          }else {
            this.user_exist = 'no-user'
          }
        },
        showSong(){
          console.log(this.$refs.audio.mediaGroup)
        },
        getMySong(){
          this.$http.post('/index/getMySong',{user_id:this.user.id})
            .then(value => {
              this.mysongs = value.data
            })
        },
        toggleMySong(){
          this.allSongs = !this.allSongs
        },
        logout(){
          sessionStorage.setItem('user_info',null)
          this.getUser()
        },
        getSongs(){
          this.$http.post('/index/getAllSongs')
            .then(value => {
              this.songs = value.data
            })
        },
        addSong(song_id){
          this.$http.post('/index/addSong',{
            user_id: this.user.id,
            song_id: song_id
          })
            .then(
              this.getMySong
              )
            .catch(e=>{
              alert('已经存在歌单中')
            })
        },
        deleteSong(song_id){
          this.$http.post('/index/deleteSong',{
            user_id: this.user.id,
            song_id:song_id
          })
            .then(
              this.getMySong
            )
        },
        play(song_url){
          let pa = song_url.replace('src/','../')
          console.log(pa)
          let myAudio = new Audio(require(pa))
          myAudio.play()
            .then(value => {
              console.log(value)
            })
            .catch(e=>{
              console.log(e)
            })
        }
      },
    created() {
      this.getUser()
      this.getSongs()
      this.getMySong()
    },
    beforeMount() {
      let ionicon = document.createElement('script')
      ionicon.setAttribute('src','https://unpkg.com/ionicons@4.5.9-1/dist/ionicons.js')
      document.body.appendChild(ionicon)
    }
  }
</script>

<style scoped>
  .jdt{
    width: 200px;
    height: 3px;
    background-color: #2c3e50;
    position: relative;
  }

  .jdt>.pin{
    position: absolute;
    bottom: 80%;
    left: 0;
    transform: translateX(-50%);
    /*z-index: 999;*/
  }

  .base-control{
    margin-right: 15px;
  }

  .player{
    display: flex;
    height: 50px;
    align-items: center;
  }

  .no-user{
    grid-template-columns: 1fr 1fr;
  }

  .exist{
    grid-template-columns: 1fr 1fr 1fr;
  }

  .grid-container{
    width: 50%;
  }

  .grid-title{
    width: 50%;
    display: grid;
  }

  .all-songs{
    /*position: relative;*/
    /*top: 10%;*/
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .grid-show{
    width: 100%;
    display: grid;
  }

  .title{
    margin-bottom: 10px;
    font-size: 24px;
    background-color: aqua;
  }

  .nav-btn{
    padding: 0;
    display: block;
    width: 100px;
    height: 40px;
    color: aliceblue;
    line-height: 40px;
    font-size: 24px;
    text-decoration: none;
    background-color: crimson;
  }

  .nav-container{
    position: absolute;
    right: 16%;
    top: 10%;
  }
</style>
