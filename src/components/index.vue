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
            <button v-on:click="playFrom(song.url)">播放</button>
            <button v-on:click="addSong(song.id)">添加入歌单</button>
          </div>
          <div v-else></div>
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
          <div v-on:click="playPrev">
            <MdSkipBackwardIcon></MdSkipBackwardIcon>
          </div>
          <div @click="play" v-if="audioStatus">
            <MdPlayIcon></MdPlayIcon>
          </div>
          <div @click="pauseAudio" v-else>
            <MdPauseIcon></MdPauseIcon>
          </div>
          <div v-on:click="playNext">
            <MdSkipForwardIcon></MdSkipForwardIcon>
          </div>
        </div>
        <div class="jdt" @click="changeTime" ref="jdt">
          <div class="pin" ref="pin">
            <MdLeafIcon></MdLeafIcon>
          </div>
          <div class="audio-text">{{auText}}</div>
        </div>
        <audio ref="audio"></audio>
<!--        <button v-on:click="showSong">显示</button>-->
      </div>
    </div>
</template>

<script>
  import jwt from 'jsonwebtoken'
  import MdPlayIcon from 'vue-ionicons/dist/md-play.vue'
  import MdSkipForwardIcon from 'vue-ionicons/dist/md-skip-forward.vue'
  import MdSkipBackwardIcon from 'vue-ionicons/dist/md-skip-backward.vue'
  import MdPauseIcon from 'vue-ionicons/dist/md-pause.vue'
  import MdLeafIcon from 'vue-ionicons/dist/md-leaf.vue'


  export default {
        name: "index",
    components:{
      MdPlayIcon,
      MdSkipBackwardIcon,
      MdSkipForwardIcon,
      MdPauseIcon,
      MdLeafIcon
    },
      data(){
          return {
            user_exist:'',
            user:{},
            songs:[],
            mysongs:[],
            allSongs:true,
            currenturl:'static/audio/yiban.mp3',
            urllist:[],
            audioStatus:true,
            inter : '',
            auText:''
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
        play(){
          clearInterval(this.inter)
          let myAudio = this.$refs.audio
          console.log(this.urllist)
          // v-bind会有延迟 ， v-model又不能用 所以直接修改 Attribute:src
          if ( myAudio.src !== 'http://localhost:8080'+encodeURI(this.currenturl)){
            myAudio.src = this.currenturl
            for (let i=0;i<this.urllist.length;i++){
              if ('/'+this.urllist[i].url===this.currenturl) {
                this.auText = this.urllist[i].title+'-'+this.urllist[i].singer
              }
            }
          }
          myAudio.play()
          // console.log(myAudio.played)
          this.audioStatus = false
          this.inter = setInterval(()=>{
            this.$refs.pin.style.left = myAudio.currentTime/myAudio.duration*100+'%'
            // console.log(myAudio.currentTime/myAudio.duration)
          },1000)
          myAudio.addEventListener('complete',()=>{
            this.playNext()
          })
        },
        pauseAudio(){
          let myAudio = this.$refs.audio
          myAudio.pause()
          this.toggleAudioStatus()
          clearInterval(this.inter)
        },
        toggleAudioStatus(){
          this.audioStatus = !this.audioStatus
        },
        playFrom(song_url){
          if (this.user) {
            this.urllist = this.songs
          }else{
            this.urllist = this.mysongs
          }
          this.currenturl = song_url.replace('static','/static')
          this.play()
        },
        playPrev(){

        },
        playNext(){
          // console.log(this.currenturl)
          // console.log(this.urllist)
          for (let i=0;i<this.urllist.length;i++) {
            if (this.urllist[i].url.replace('static','/static')===this.currenturl) {
              if (i+1<this.urllist.length){
                this.currenturl = this.urllist[++i].url.replace('static','/static')
              } else {
                this.currenturl = this.urllist[0].url.replace('static','/static')
              }
              this.play()
            }
          }
        },
        changeTime(){
          let audio = this.$refs.audio,
            pin = this.$refs.pin,
            jdt = this.$refs.jdt,
            mouseX = event.clientX,
            jdtLeft = this.$refs.jdt.getBoundingClientRect().left,
            jdtRight = jdt.getBoundingClientRect().right,
            jdtLength = jdtRight - jdtLeft,
            relativeX = mouseX - jdtLeft,
            perc = relativeX / jdtLength
          if (event.target === jdt){
            pin.style.left = perc*100+'%'
            audio.currentTime = audio.duration * perc
          }
        }
      },
    created() {
      this.getUser()
      this.getSongs()
      this.getMySong()
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
    bottom: 0;
    left: 0;
    transform: translateX(-50%);
    /*z-index: 999;*/
  }

  .base-control{
    display: flex;
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
