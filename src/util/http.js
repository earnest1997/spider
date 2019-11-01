import axios from 'axios'

const headers = {
  Referer: 'https://juejin.im/post/5db66672f265da4d0e009aad',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36'
}
const _axios = axios.create({
  baseURL: 'http://0.0.0.0:3000',
  timeout: 4000,
  headers
})
_axios.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => {
    console.log('请求失败')
    return Promise.reject(err)
  }
)
_axios.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    console.log('响应错误', err)
    return Promise.reject(err)
  }
)

function formatBody(data, isTurnForm) {
  if (!isTurnForm) {
    return data
  }
  const form = new FormData()
  for (let [k, v] of data) {
    form.append(k, v)
  }
  return form
}

export const get = async (url, params) => {
  const { data } = await _axios.get(url, { params })
  return data
}
export const post = async (url, data) => {
  return await _axios.post(url, formatBody(data))
}
