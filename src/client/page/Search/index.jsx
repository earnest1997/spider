import React,{useEffect} from 'react'
import { connect } from '@/store'
import cp from '@/components'
import { useRequest } from 'util'
import './index.scss'

function SearchList({ list }) {
  return (
    <div className='search-inner-wrapper'>
      <h2>{`共搜索到文章${list.length}篇`}</h2>
      {list.map((item) => (
        <cp.ListItem {...item} key={item.id} type='search' />
      ))}
    </div>
  )
}

const Search = (props) => {
  const {
    location: {
      state: { keywords }
    },
    searchList,
    getSearchList
  } = props
  const storeList=window.sessionStorage.searchList && JSON.parse(window.sessionStorage.searchList)
  const finalList=searchList || storeList
  useRequest(getSearchList,false, keywords)
  useEffect(()=>{
    return ()=>window.sessionStorage.clear()
  },[])
  return finalList ? (
    <div className='search wrapper'>
      <main>
        {(finalList.length && (
          <SearchList list={finalList} />
        )) || <cp.Empty />}
      </main>
    </div>
  ) : (
    <cp.Loading  style={{ height: 465 }} visible/>
  )
}

export default connect((store) => ({
  searchList: store.article.searchList,
  getSearchList: store.getSearchList
}))(Search)
