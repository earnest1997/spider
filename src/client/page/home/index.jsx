import React, { useEffect } from 'react'
import cp from '@/components'
import { connect } from '@/store'
import './index.scss'

const Home = (props) => {
  const { hotArticleList, getHotArticleList } = props
  console.log(getHotArticleList)
  useEffect(() => {
    getHotArticleList()
  }, []) //eslint-disable-line
  return (
    <div className='wrapper home'>
      <main>
        {hotArticleList.map((item) => (
          <cp.ListItem {...item} key={item.id} type='hot' />
        ))}
      </main>
    </div>
  )
}

export default connect((state) =>{
  console.log(state)
  return({
    hotArticleList: state.article.hotArticleList,
    getHotArticleList: state.getHotArticleList
  })})(Home)

