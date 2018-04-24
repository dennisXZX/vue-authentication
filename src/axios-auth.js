import axios from 'axios'

// create an Axios instance
const instance = axios.create({
  baseURL: 'https://vue-authentication-67776.firebaseio.com'
})

export default instance