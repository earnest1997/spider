import axios from 'axios'

const _axios=axios.create()
_axios.interceptors.request.use(config=>{
  console.log(config,'config')
},err=>{
  console.log('请求失败')
  return Promise.reject(err)
})
_axios.interceptors.request.use(res=>{
  console.log(res,'res')
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