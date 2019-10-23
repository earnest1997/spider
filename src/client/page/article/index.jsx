import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { context } from '@/client/store'
import './index.scss'

const Article = (props) => {
  const {
    match: {
      params: { id }
    }
  } = props
  const { getArticleDetail, articleDetail } = useContext(context)
  useEffect(() => {
    getArticleDetail(id)
  }, [])
  const { title, content, author } = articleDetail
  console.log(articleDetail,'art')
  return (
    <div className='wrapper article'>
    <main>
      <div className='row row-01'>{title}</div>
      <div className='row row-02'>
        <span>作者:&nbsp;{author}</span>
      </div>
      <div className='row row-03'>{content}</div>
      </main>
    </div>
  )
}

export default withRouter(Article)
