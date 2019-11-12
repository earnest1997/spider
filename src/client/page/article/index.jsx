import React, {  useContext, useCallback, useEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'
import { withRouter } from 'react-router-dom'
import { context } from '@/store'
import {
  classNames,
  useLazyLoad,
  useRequest,
  copy as copyExec
} from 'util'
import { isEmptyData } from 'util'
import { Loading, Empty } from '@/components'
import './index.scss'

function useCopyCode(articleDetail) {
  const copy = useCallback((index, codeList) => {
    const code = codeList[index].textContent
    copyExec(code)
  }, [])
  useEffect(() => {
    const copyBtnList = document.querySelectorAll('[class*=copy-0]')
    const codeList = document.querySelectorAll('[class*=code-0]')
    if (!isEmptyData(articleDetail) && !articleDetail.noData) {
      for (let [index, btn] of Object.entries(Array.from(copyBtnList))) {
        const copyHandler = copy.bind(null, index,codeList)
        btn.addEventListener('click', copyHandler)
      }
      return () => {
        const container = document.getElementsByClassName('wrapper')[0]
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
    }
  } = props
  const type = path.split('/')[1]
  const { getArticleDetail, articleDetail } = useContext(context)
  const { title, content, author, baseClassName } = articleDetail
  useRequest(getArticleDetail,true, id, type)
  useCopyCode(articleDetail)
  // useLazyLoad(baseClassName)
  if (isEmptyData(articleDetail)) {
    return <Loading />
  } else if (articleDetail.noData) {
    return <Empty />
  }
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

export default withRouter(Article)
