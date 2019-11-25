import React, { useCallback, useEffect } from 'react'
import { unmountComponentAtNode, render } from 'react-dom'
import {withRouter} from 'react-router-dom'
import {connect} from '@/store'
import { classNames, useRequest, copy as copyExec } from 'util'
import cp from '@/components'
import { getCollects, postCollect } from '@/service'
import './index.scss'
import { useScroll } from 'util/hooks'

const { Loading, Empty, Modal, CheckBox } = cp

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

function CollectModal() {
  const collects = {'test':{de:90,dee:99},test1:{dd:9}}
  return (
    <Modal title='添加到收藏夹' visible isOkBtnVisible isCancelBtnVisible>
      <div className='collect-modal-content'>
        <div className='row row-01'>
          {Object.entries(collects).map(([k, v]) => {
            return (
              <div className='collect-item' key={k}>
                <span>
                  <CheckBox />
                  {k}
                </span>
                <span>{Object.values(v).length}/10</span>
              </div>
            )
          })}
        </div>
        <div className='row row-02'>
          <i className='icon ion-add' />
          新建收藏夹
        </div>
      </div>
    </Modal>
  )
}

function SiderTool() {
  const handleClick = () => {
    // const isLogin = window.sessionStorage.isLogin
    // if (!isLogin) {
    //   Modal.info({
    //     content: '请先登录',
    //     title: '提示'
    //   })
    // } else {
      const container = document.createElement('div')
      render(<CollectModal/>, container)
    // }
  }
  return (
    <div className='sider' onClick={handleClick}>
      <span>
        <i className='icon ion-md-star' />
      </span>
    </div>
  )
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
  const isSiderVisible = useScroll(300)
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
        {isSiderVisible && <SiderTool />}
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
