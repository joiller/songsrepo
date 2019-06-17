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
          <div class="songs-title">
            <span>{{song.title}}</span>
            <img v-if="song.isVip" width="20" src="/static/icons/VIP.png" alt="">
          </div>
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
          <div>
            <span>{{song.title}}</span>
            <img src="/static/icons/VIP.png" alt="">
          </div>
          <span>{{song.singer}}</span>
          <div v-if="user">
            <button v-on:click="playFrom(song.url,song.isVip)">播放</button>
            <button v-on:click="deleteSong(song.id)">从歌单删除</button>
          </div>
        </div>
      </div>
      <div class="player">
        <div class="base-control">
          <div v-on:click="playPrev" class="icon">
            <MdSkipBackwardIcon></MdSkipBackwardIcon>
          </div>
          <div @click="play" v-if="audioStatus" class="icon">
            <MdPlayIcon></MdPlayIcon>
          </div>
          <div @click="pauseAudio" v-else class="icon">
            <MdPauseIcon></MdPauseIcon>
          </div>
          <div v-on:click="playNext" class="icon">
            <MdSkipForwardIcon></MdSkipForwardIcon>
          </div>
        </div>
        <div class="jdt" @click="changeTime" ref="jdt">
          <div class="pin" ref="pin">
            <MdLeafIcon></MdLeafIcon>
          </div>
          <div class="audio-text">{{auText}}</div>
        </div>
        <div class="order" @click="changeOrder" ref="order">
          <img src="/static/icons/列表循环.png" alt="" style="display: block">
          <img src="/static/icons/单曲循环.png" alt="" style="display:none;">
          <img src="/static/icons/随机播放.png" alt="" style="display:none;">
        </div>
        <div class="volume">
          <div @click="toggleVolume">
            <MdVolumeHighIcon class="volume-trigger"/>
          </div>
          <div class="volume-msg">
            <div class="volume-data" ref="volume-data">
              <div class="volume-has" ref="volume-has"></div>
              <div class="volume-pin" ref="volume-pin" draggable="true" @dragstart="startdrag" @drag="changeVolume"></div>
            </div>
          </div>
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
  import MdVolumeHighIcon from 'vue-ionicons/dist/md-volume-high.vue'



  export default {
        name: "index",
    components:{
      MdPlayIcon,
      MdSkipBackwardIcon,
      MdSkipForwardIcon,
      MdPauseIcon,
      MdLeafIcon,
      MdVolumeHighIcon
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
            auText:'',
            order:0,
            shuffleList:[]
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
          console.log(this.currenturl)
          let myAudio = this.$refs.audio
          // console.log(this.urllist)

          // v-bind会有延迟 ， v-model又不能用 所以直接修改 Attribute:src
          if ( myAudio.src !== 'http://localhost:8080'+encodeURI(this.currenturl)){
            for (let i=0;i<this.urllist.length;i++){
              if ('/'+this.urllist[i].url===this.currenturl){
                if (this.urllist[i].isVip && !this.user.isVip) {
                  if (this.order !== 2){
                    this.playNext()
                  }else {
                    this.shuffle()
                  }
                }
              }
            }
            myAudio.src = this.currenturl
            for (let i=0;i<this.urllist.length;i++){
              if ('/'+this.urllist[i].url===this.currenturl) {
                this.auText = this.urllist[i].title+'-'+this.urllist[i].singer
              }
            }
          }
          myAudio.play()
          // myAudio.addEventListener('complete',this.playNext)
          this.audioStatus = false
          this.inter = setInterval(()=>{
            this.$refs.pin.style.left = myAudio.currentTime/myAudio.duration*100+'%'
            // console.log(myAudio.currentTime/myAudio.duration)
          },1000)

          // myAudio.addEventListener('complete',()=>{
          //   console.log('complete')
          // })
          // myAudio.addEventListener('ended',(event)=>{
          //   this.playNext()
          // })
          //箭头函数不改变VUE的this值，function()会改变
          myAudio.onended = ()=>{
            if (this.order ===2) {
              this.shuffle()
            }else {
              this.playNext()
            }
          }
        },
        pauseAudio(){
          let myAudio = this.$refs.audio
          myAudio.pause()
          this.audioStatus = true
          clearInterval(this.inter)
        },
        toggleAudioStatus(){
          this.audioStatus = !this.audioStatus
        },
        playFrom(song_url){
          if (this.allSongs) {
            this.urllist = this.songs
          }else{
            this.urllist = this.mysongs
          }
          this.currenturl = song_url.replace('static','/static')
          this.play()
        },
        playPrev(){
          for (let i=0;i<this.urllist.length;i++){
            if ('/'+this.urllist[i].url===this.currenturl) {
              if (i>0) {
                this.currenturl = '/'+this.urllist[--i].url
              }else {
                this.currenturl = '/'+this.urllist[this.urllist.length-1].url
              }
              break
            }
          }
          this.play()
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
              break
            }
          }
          this.play()
        },

        //change系列
        startdrag(){

        },
        changeVolume(){
          let mouseY = event.clientY,
            volDT = this.$refs['volume-data'],
            volBottom = volDT.getBoundingClientRect().bottom,
            volTop = volDT.getBoundingClientRect().top,
            volLength = volDT.getBoundingClientRect().height,
            relativeY = volBottom - mouseY,
            volPin = this.$refs['volume-pin'],
            volHas = this.$refs['volume-has'],
            perc = relativeY / volLength,
            audio = this.$refs.audio
          console.log(mouseY)
          console.log(event.clientY)
          // console.log(volBottom)
          // console.log(perc)
          if (perc>1) {
            volPin.style.bottom = 100+'%'
            audio.volume = 1
          }else if (perc<0){
            volPin.style.bottom = 0 + '%'
            audio.volume = 0
          } else {
            volPin.style.bottom = perc * 100 + '%'
            audio.volume = perc
          }
          volHas.style.height = volPin.style.bottom
        },

        toggleVolume(){
          let audio = this.$refs.audio,
            volHas = this.$refs['volume-has']
          if (audio.muted) {
            audio.muted = false
            volHas.style.backgroundColor = 'bisque'
          }else {
            audio.muted = true
            volHas.style.backgroundColor = 'rgba(0,0,0,.7)'
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
            console.log(audio.currentTime)
            console.log(audio.duration)
            console.log(perc)
          }
        },
        changeOrder(){
          let orders = this.$refs.order.children
          for (let i=0;i<orders.length;i++) {
            orders[i].style.display = 'none'
          }
          if (this.order>=orders.length-1) {
            this.order=0
          }else{
            this.order++
          }
          orders[this.order].style.display = 'block'
          let audio = this.$refs.audio
          switch (this.order) {
            case 1:
              audio.loop = true
                  break
            case 2:
              audio.loop = false;
              this.shuffleList = [...this.urllist]
                  break
            default:
              audio.loop = false
          }
        },
        shuffle(){
          for (let i=0;i<this.shuffleList.length;i++){
            if ('/'+this.shuffleList[i].url===this.currenturl){
              this.shuffleList.splice(i,1)
              console.log(this.shuffleList)
            }
          }
          if (this.shuffleList.length===0) {
            this.shuffleList = [...this.urllist]
          }
          let index = Math.floor(Math.random()*Math.floor(this.shuffleList.length))
          this.currenturl = '/'+this.shuffleList[index].url
          this.play()
        },
        resetVol(){
          this.$refs.audio.volume = .5
          this.$refs['volume-pin'].style.bottom = .5 * 100 + '%'
          this.$refs['volume-has'].style.height = .5 * 100 + '%'
        }
      },
    created() {
      this.getUser()
      this.getSongs()
      this.getMySong()
    },
    mounted() {
          document.addEventListener('dragover',ev => {
            ev.preventDefault()
          })
      this.resetVol()
    }
  }
</script>

<style scoped>
  .volume{
    position: relative;
  }

  .volume:hover .volume-msg{
    display: block;
  }

  .volume-msg{
    display: none;
    position: absolute;
    width: 30px;
    height: 100px;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0,0,0,.4);
  }

  .volume-data{
    width: 5px;
    height: 90%;
    background-color: #2c3e50;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .volume-pin{
    width: 10px;
    height: 10px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%,50%);
    background-color: bisque;
    border-radius: 50%;
  }

  .volume-has{
    width: 100%;
    position: absolute;
    bottom: 0;
    background-color: bisque;
  }

  .order img{
    width: 24px;
  }

  .jdt{
    width: 200px;
    height: 3px;
    background-color: #2c3e50;
    position: relative;
  }

  .audio-text{
    position: absolute;
    z-index: -1;
  }

  .jdt>.pin{
    position: absolute;
    bottom: 100%;
    left: 0;
    transform: translateX(-50%);
    /*z-index: 999;*/
  }

  .ion{
    width: 35px;
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /*.ion{*/
  /*  display: flex;*/
  /*  align-items: center;*/
  /*}*/

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

  .songs-title{
    justify-content: center;
    display: flex;
    align-items: center;
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
