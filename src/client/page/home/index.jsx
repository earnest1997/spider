import React, { useEffect, useCallback, useState } from 'react'
import cp from '@/components'
import { connect } from '@/store'
import './index.scss'

const requestCount = 5
const Home = (props) => {
  const [storeHotListLength,setStoreLength]=useState()
  const [storeVisible,setStoreVisible]=useState()
  const { hotArticleList, getHotArticleList, hotListLength } = props
  useEffect(() => {
    getHotArticleList(0, requestCount)
  }, []) //eslint-disable-line
  useEffect(()=>{
    if(!storeVisible && hotArticleList && hotArticleList.length){
      setStoreVisible(true)
    }
    if(!storeHotListLength && hotListLength){
      setStoreLength(hotListLength)
    }
  },[hotArticleList, hotListLength, storeHotListLength, storeVisible])
  const handleChange = useCallback(
    (index) => {
      getHotArticleList(index * requestCount, requestCount)
    },
    [getHotArticleList]
  )

  return (
    <div className='wrapper home'>
      <main>
        {hotArticleList ? (
          <>
            {hotArticleList.length ? (
              <div className='row row-1'>
                {hotArticleList.map((item) => (
                  <cp.ListItem {...item} key={item.id} type='hot' />
                ))}
              </div>
            ) : (
              <cp.Empty />
            )}
          </>
        ) : (
          <cp.Loading visible style={{ height: 465 }} />
        )}
        <cp.Pagination
          visible={storeVisible}
          total={storeHotListLength}
          pageSize={requestCount}
          onChange={handleChange}
        />
      </main>
    </div>
  )
}

export default connect((state) => ({
  hotArticleList: state.article.hotArticleList,
  hotListLength: state.article.hotListLength,
  getHotArticleList: state.getHotArticleList
}))(Home)
