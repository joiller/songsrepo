<template>
    <div class="login-container">
      <div class="login">
        <label for="user_name">用户名</label>
        <input type="text" name="user_name" v-model="user_name" required>

        <label for="password">密码</label>
        <input type="password" name="password" v-model="password" required>
        <div v-if="!logSite">性别</div>
        <div v-if="!logSite" class="sex-show">
          <input type="radio" name="sex"  id="man" value=1>
          <label for="man">男</label>||
          <input type="radio" name="sex" id="woman" value=0>
          <label for="woman">女</label>
        </div>
        <div></div>
        <input v-if="logSite" type="button" value="登录" class="loginbtn" v-on:click="log">
        <input v-else type="button" value="注册" class="loginbtn" v-on:click="sign">
      </div>
      <button v-if="logSite" v-on:click="toggleLog" class="toggleBtn">还没账号？注册</button>
      <button v-else v-on:click="toggleLog" class="toggleBtn">已有账号？登录</button>
    </div>
</template>

<script>
    export default {
        name: "login",
      data(){
          return {
            user_name:'',
            password:'',
            sex: 1,
            logSite:true
          }
      },
      methods:{
          toggleLog(){
            this.logSite = !this.logSite
          },
          log(){
            const name = this.user_name,
              password = this.password
            this.$http.post('/login',{
              "name": name,
              "password": password
            })
              .then(res => {
                sessionStorage.setItem('user_info',res.data.token)
                this.$router.push('/')
              })
              .catch(e=>{
                console.log(e)
              })
          },
        sign(){
            const data = {
              name: this.user_name,
              password: this.password,
              sex: this.sex
            }
            this.$http.post('/login/sign',data)
              .then(value => {
                if (value.data.success) {
                  this.log()
                } else {
                  alert('用户名已存在')
                }
              })
        }
      }
    }
</script>

<style scoped>
  .login-container{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .login{
    display: grid;
    width: 15%;
    grid-template-columns: .3fr 1fr;
    grid-row-gap: 10px;
    justify-content: center;
  }

  input{
    justify-self: center;
    width: 80%;
    box-sizing: border-box;
    padding: 1px;
    border: solid 1px;
  }

  label{
    /*display: block;*/
  }

label:has(input:focus){
  background-color: crimson;
}

  .loginbtn{
    justify-self: right;
    height: 45px;
  }

  input[type='radio']{
    display: none;
  }

  #man:checked~label[for='man']{
    font-size: 24px;
  }
  #woman:checked~label[for='woman']{
    font-size: 24px;
  }

  .sex-show{
    display: flex;
    justify-content: center;
  }

  .toggleBtn{
    margin-top: 10px;
    height: 40px;
  }

</style>
