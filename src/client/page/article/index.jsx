import React, {  useRef, useContext,useCallback,useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { context } from '@/store'
import {classNames,useLazyLoad,useRequest,enumerate,copy} from 'util'
import {isEmptyData} from 'util'
import { Loading,Empty } from '@/components'
import './index.scss'

function useCopyCode(){
  const copyBtnList=document.querySelectorAll("[class^=copy-0]")
  const codeList=document.querySelectorAll("[class^=code-0]")
  const copyHandler=useCallback((index)=>{
  const code=codeList[index].textContent
  copy(code)
  },[codeList])
  for(let [index,btn] in enumerate(copyBtnList)){
    btn.addEventListener("click",copyHandler.bind(null,index))
  }
}

const Article = (props) => {
  const {
    match: {
      params: { id },
      path
    }
  } = props
  const type=path.split('/')[1]
  const { getArticleDetail, articleDetail } = useContext(context)
  const { title, content, author,baseClassName } = articleDetail 
  useRequest(getArticleDetail,id,type)
  // useLazyLoad(baseClassName)
  const loadingRef=useRef()
 if (isEmptyData(articleDetail)){
    loadingRef.current=Loading.show()
    return <Loading/>
  }
  else if(articleDetail.noData){
    loadingRef.current && loadingRef.current.hide()
    return <Empty/>
  } 
  loadingRef.current.hide()
  return (
    <div className='wrapper article'>
    <main>
      <div className='row row-01'>{title}</div>
      <div className='row row-02'>
        <span>作者:&nbsp;{author}</span>
      </div>
      <div className={classNames('row row-03',baseClassName)} dangerouslySetInnerHTML={{__html:content}}/>
      </main>
    </div>
  )
}


export default withRouter(Article)
