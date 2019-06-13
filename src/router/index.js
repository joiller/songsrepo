import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWo',
      component: index
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
