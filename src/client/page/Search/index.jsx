import React, { useContext } from 'react'
import { context } from '@/client/store'
import { ListItem } from '@/client/components'

export const Search = () => {
  const { searchResultList } = useContext(context)
  return searchResultList.length ? (
    <SearchList list={searchResultList} />
  ) : (
    <Empty />
  )
}

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

function Empty() {
  return (
    <div className='search'>
      <h1>没有结果</h1>
    </div>
  )
}
