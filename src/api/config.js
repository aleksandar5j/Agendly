import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://577z123.e2.mars-hosting.com/api',
})

export default instance
