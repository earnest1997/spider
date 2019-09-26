import {useState,useEffect} from 'React'
import {getHotArticlesL} from '../api'

export function initState(){
  return{...getHotArticlesList()}
}

export const getHotArticlesList=()=>{
  const [hotArticlesList,updateHotArticlesList]=useState([])
  updateHotArticlesList(getHotArticlesL)
  return [...hotArticlesList]
}