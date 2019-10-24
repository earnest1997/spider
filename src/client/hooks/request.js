import {useEffect,useState} from 'react'
function useRequest(request,shouldStore){
useEffect(()=>{
const [data,setData]=useState()
if(shouldStore){
request.then(res=>{
  setData(res)
})
}
},[])
}