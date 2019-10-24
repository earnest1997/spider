import React,{useContext} from 'react'
import {context} from '@/client/store'
import { ListItem } from '@/client/components'

export const Search=()=>{
  const {searchResultList}=useContext(context)
  return <div className='search'>
{searchResultList.map((item) => (
  <ListItem {...item} key={item.id}/>
))}
  </div>
}