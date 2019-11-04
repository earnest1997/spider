import {
  getSearchResultListApi,
  getHotArticleListApi,
  getArticleDetailApi,
} from '@/client/service'
import React, { useEffect, useReducer, createContext } from 'react'

export const context = createContext({})
const reducers = (state, action) => {
  const {
    type,
    hotArticleList,
    searchResultList,
    articleDetail
  } = action
  switch (type) {
    case 'setHotArticleList':
      return { ...state, ...{ hotArticleList } }
    case 'setSearchResultList':
      return { ...state, ...{ searchResultList } }
    case 'setArticleDetail':
      return { ...state, ...{ articleDetail } }
    default:
      return state
  }
}
// 搜索文章列表
const getSearchListSaga = (dispatch) => async (keywords) => {
  const getSearchResultList = await getSearchResultListApi(keywords)
  dispatch({ type: 'setgetSearchResultList', getSearchResultList })
}
// 获取文章详情

// // 热门文章列表
// const getHotArticleListSaga=(dispatch) => async (id) => {
//   const articleDetail = await getHotArticleListApi(id)
//   dispatch({ type: 'setArticleDetail', articleDetail })
// }
// 热门文章详情
// const getHotArticleDetailSaga = (dispatch) => async (id) => {
//   const hotArticleDetail = await getHotArticleDetailApi(id)
//   dispatch({ type: 'setHotArticleDetail', hotArticleDetail })
// }
// 获取文章详情
const getArticleDetailSaga = (dispatch) => async (id,type) => {
  const articleDetail = await getArticleDetailApi(id,type)
  dispatch({ type: 'setArticleDetail', articleDetail })
}

function combineSagas() {
  const initialState = {
    hotArticleList: [],
    searchResultList: [],
    articleDetail: { title: '', content: '', author: '' }
  }
  const [state, dispatch] = useReducer(reducers, initialState)
  useEffect(() => {
    getHotArticleListApi()
      .then((data) => {
        const { hotArticleList } = data
        dispatch({ type: 'setHotArticleList', hotArticleList })
      })
      .catch((err) => {
        console.log(err, 'fetchhot err')
      })
    // getArticleDetailApi()
    //   .then(articleDetail=>{
    //     dispatch({type:'setArticleDetail',articleDetail})
    //   })
    //   .catch(err=>{
    //     console.log(err,'fetch hot detail err')
    //   })
  }, [])
  return {
    ...state,
    ...{ getSearchList: getSearchListSaga(dispatch) },
    ...{ getArticleDetail: getArticleDetailSaga(dispatch) }
  }
}
export const ContextProvider = ({ children }) => {
  return <context.Provider value={combineSagas()}>{children}</context.Provider>
}
