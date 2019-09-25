import {useState,useEffect} from 'React'
import {getHotArticlesApi} from '../../util/api'


export function initState(){
  
}

export const getHotArticles=()=>{
  const [hotArticlesList,updateHotArticlesList]=useState([])
  getHotArticlesApi().then(data=>{
  updateHotArticlesList(data)
  })
  return {hotArticlesList}
}