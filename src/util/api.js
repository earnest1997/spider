import 'axios' from 'axios'

export const getHotArticles=()=>{
axios.get('/hotArticles',(req,res)=>{
  return res.json()
})
}