import axios from 'axios'

// create an Axios instance
const instance = axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

export default instance