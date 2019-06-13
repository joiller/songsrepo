// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

router.beforeEach((to,from,next)=>{
  const token = sessionStorage.getItem('token-by-vue')
  if (token){
    if (to.path === '/#/login') {
      console.log('to login')
      to.path = '/songsrepo'
      next()
    }
  }else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
