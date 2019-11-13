import React,{useContext,useEffect} from 'react'
import cp from '@/components'
import {context} from '@/store'
import './index.scss'

export const Home =()=> {
    const {hotArticleList,getHotArticleList}=useContext(context)
    useEffect(()=>{
      getHotArticleList()
    },[]) //eslint-disable-line
    return (
      <div className='wrapper home'>
        <main>
          {hotArticleList.map((item) => (
            <cp.ListItem {...item} key={item.id} type='hot'/>
          ))}
        </main>
      </div>
    )
}


