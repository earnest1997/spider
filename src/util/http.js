import axios from 'axios'

const _axios=axios.create({baseURL:'http://0.0.0.0:3000'})
_axios.interceptors.request.use(config=>{
  return config
},err=>{
  console.log('请求失败')
  return Promise.reject(err)
})
_axios.interceptors.response.use(res=>{
  return res
},err=>{
console.log('响应错误',err)
return Promise.reject(err)

})

function formatBody(data,isTurnForm){
  if(!isTurnForm){
    return data
  }
  const form=new FormData()
  for(let [k,v] of data){
   form.append(k,v)
  }
  return form
}

export const get=async(url,params)=>{
  const {data} = await _axios.get(url,{params})
  return data
}
export const post =async(url,data)=>{
  return await _axios.post(url,formatBody(data))
}

