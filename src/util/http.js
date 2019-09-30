import axios from 'axios'

const _axios=axios.create({baseURL:'http://0.0.0.0:3000'})
_axios.interceptors.request.use(config=>{
  console.log(config,'config')
  return config
},err=>{
  console.log('请求失败')
  return Promise.reject(err)
})
_axios.interceptors.response.use(res=>{
  console.log(res,'res')
  return res
},err=>{
console.log('响应错误')
return Promise.reject(err)

})

export const get=async(url,params)=>{
  return await _axios.get(url,params)
}
export const post =async(url,body)=>{
  return await _axios.post(url,{...body})
}