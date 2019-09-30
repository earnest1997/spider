import {getHotArticlesApi} from '../api'
import {useState,useEffect} from 'react'


const getHotArticlesList =() =>{
  const [hotArticlesList,updateHotArticlesList]=useState([])
  useEffect(()=>{
  getHotArticlesApi().then(({data})=>{
    const {hotArticlesList} =data
    updateHotArticlesList(hotArticlesList)
  })
},[])
return {hotArticlesList}
}


export const initState=()=>{
  return {...getHotArticlesList()}
}