import React,{useContext} from 'react'
import { ListItem } from '@/client/components'
import {context} from '@/client/store'
// import {functionType} from '../../util/ts'
import './index.scss'

export const Home =()=> {
    const {state:{hotArticlesList}}=useContext(context)
    return (
      <div className='home'>
        <main>
          {hotArticlesList.map((item) => (
            <ListItem {...item} key={item.id}/>
          ))}
        </main>
      </div>
    )
}


