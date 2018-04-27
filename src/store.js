import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'

import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    users: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    storeUser(state, users) {
      state.users = users
    },
    clearAuthData(state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    // force the user to log out when the JWT expires
    setLogoutTimer(context, expirationTime) {
      setTimeout(() => {
        context.dispatch('logout')
      }, expirationTime * 1000)
    },
    signup(context, authData) {
      // https://firebase.google.com/docs/reference/rest/auth/#section-create-email-password
      axios.post('/signupNewUser?key=AIzaSyDrZ4xYseIhxdgAjA4topcGOFhAif4FhCU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          context.commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })

          // store the JWT in local storage
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)

          // store the new user to database
          context.dispatch('storeUser', authData)

          // redirect to dashboard
          router.replace('/dashboard')

          // dispatch the auto log out action
          context.dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },
    autoLogin(context) {
      const token = localStorage.getItem('token')

      // should not log in the user if the JWT is not in local storage
      if (!token) {
        return
      }

      const expirationDate = localStorage.getItem('expirationDate')
      const now = new Date()

      // should not log in the user if the token has expired
      if (now >= expirationDate) {
        return
      }

      const userId = localStorage.getItem('userId')

      context.commit('authUser', {
        token: token,
        userId: userId
      })
    },
    signin(context, authData) {
      // https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
      axios.post('/verifyPassword?key=AIzaSyDrZ4xYseIhxdgAjA4topcGOFhAif4FhCU', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          context.commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })

          // store the JWT in local storage
          const now = new Date()
          const expirationDate = new Date(now.getTime() + res.data.expiresIn * 1000)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          localStorage.setItem('expirationDate', expirationDate)

          // redirect to dashboard
          router.replace('/dashboard')

          // dispatch the auto log out action
          context.dispatch('setLogoutTimer', res.data.expiresIn)
        })
        .catch(error => console.log(error))
    },
    logout(context) {
      // clear up all JWT stored in the state
      context.commit('clearAuthData')

      // redirect to sign in page
      router.replace('/signin')

      // clear the local storage
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('expirationDate')
    },
    storeUser(context, userData) {
      if (!context.state.idToken) {
        return
      }

      // send a post request with the JSON Web Token
      globalAxios.post(`/users.json?auth=${context.state.idToken}`, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },
    fetchUser(context) {
      if (!context.state.idToken) {
        return
      }

      // send a get request with the JSON Web Token
      globalAxios.get(`/users.json?auth=${context.state.idToken}`)
        .then(res => {
          const data = res.data
          const users = []

          // convert the data object into an array
          for (let key in data) {
            const user = data[key]
            user.id = key
            users.push(user)
          }

          context.commit('storeUser', users)
        })
        .catch(error => console.log(error))
    }
  },
  getters: {
    users(state) {
      return state.users
    },
    isAuthenticated(state) {
      return state.idToken !== null
    }
  }
})