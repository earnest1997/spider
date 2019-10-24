import React,{useContext} from 'react'
import { ListItem } from '@/client/components'
import {context} from '@/client/store'
// import {functionType} from '../../util/ts'
import './index.scss'

export const Home =()=> {
    const {hotArticleList}=useContext(context)
    return (
      <div className='wrapper home'>
        <main>
          {hotArticleList.map((item) => (
            <ListItem {...item} key={item.id} type='hot'/>
          ))}
        </main>
      </div>
    )
}


