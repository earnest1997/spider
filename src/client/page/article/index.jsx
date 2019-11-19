import React, { useCallback, useEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { withRouter } from 'react-router-dom'
import { classNames, useRequest, copy as copyExec } from 'util'
import {connect} from '@/store'
import cp from '@/components'
import './index.scss'

const { Loading, Empty } = cp

function useCopyCode(articleDetail) {
  const copy = useCallback((index, codeList) => {
    const code = codeList[index].textContent
    copyExec(code)
  }, [])
  useEffect(() => {
    const copyBtnList = document.querySelectorAll('[class*=copy-0]')
    const codeList = document.querySelectorAll('[class*=code-0]')
    if (articleDetail && !articleDetail.noData) {
      for (let [index, btn] of Object.entries(Array.from(copyBtnList))) {
        const copyHandler = copy.bind(null, index, codeList)
        btn.addEventListener('click', copyHandler)
      }
      return () => {
        const container = document.getElementsByClassName('row-03')[0]
        unmountComponentAtNode(container)
      }
    }
  }, [articleDetail, copy])
}

const Article = (props) => {
  const {
    match: {
      params: { id },
      path
    },
    getArticleDetail,
    articleDetail
  } = props
  const type = path.split('/')[1]
  useRequest(getArticleDetail, true, id, type)
  useCopyCode(articleDetail)
  // useLazyLoad(baseClassName)
  if (!articleDetail) {
    return <Loading />
  } else if (articleDetail && articleDetail.noData) {
    return <Empty />
  }
  const { title, content, author, baseClassName } = articleDetail
  return (
    <div className='wrapper article'>
      <main>
        <div className='row row-01'>{title}</div>
        <div className='row row-02'>
          <span>作者:&nbsp;{author}</span>
        </div>
        <div
          className={classNames('row row-03', baseClassName)}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
    </div>
  )
}

export default withRouter(
  connect((state) => ({
    articleDetail: state.article.articleDetail,
    getArticleDetail: state.getArticleDetail
  }))(Article)
)
