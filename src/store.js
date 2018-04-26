import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'

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
    }
  },
  actions: {
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

          context.dispatch('storeUser', authData)
        })
        .catch(error => console.log(error))
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
        })
        .catch(error => console.log(error))
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
    }
  }
})