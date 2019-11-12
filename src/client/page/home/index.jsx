import React,{useContext} from 'react'
import cp from '@/components'
import {context} from '@/store'
// import {functionType} from '../../util/ts'
import './index.scss'

export const Home =()=> {
    const {hotArticleList}=useContext(context)
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


