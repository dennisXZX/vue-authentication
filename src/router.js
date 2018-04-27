import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'

import WelcomePage from './components/welcome/welcome.vue'
import DashboardPage from './components/dashboard/dashboard.vue'
import SignupPage from './components/auth/signup.vue'
import SigninPage from './components/auth/signin.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: WelcomePage },
  { path: '/signup', component: SignupPage },
  { path: '/signin', component: SigninPage },
  {
    path: '/dashboard',
    component: DashboardPage,
    beforeEnter(to, from, next) {
      const localToken = localStorage.getItem('token')

      // if there is a token in the state or in local storage, proceed to dashboard page
      if (store.state.idToken || localToken) {
        next()
      } else {
        next('/signin')
      }
    }
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})