import React, { useContext } from 'react'
import { context } from '@/store'
import { ListItem } from '@/components'
import {useRequest,WithLoadingHoc} from 'util'



function SearchList({ list }) {
  return (
    <div className='search'>
      <h2>{`共搜索到文章${list.length}篇`}</h2>
      {list.map((item) => (
        <ListItem {...item} key={item.id} type='search' />
      ))}
    </div>
  )
}


export const Search = (props) => {
  const {location:{state:{keywords}}}=props
  const {getSearchList } = useContext(context)
  const [searchResultList]=useRequest(getSearchList,keywords)
  return WithLoadingHoc(SearchList,searchResultList)
}
