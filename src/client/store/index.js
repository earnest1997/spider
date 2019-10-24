import {
  getSearchResultListApi,
  getHotArticleListApi,
  getHotArticleDetailApi,
  getSearchArticleDetailApi
} from '@/client/service'
import React, { useEffect, useReducer, createContext } from 'react'

export const context = createContext({})
const reducers = (state, action) => {
  const {
    type,
    getHotArticleList,
    getSearchResultList,
    hotArticleDetail,
    searchResultDetail
  } = action
  switch (type) {
    case 'setHotArticleList':
      return { ...state, ...{ getHotArticleList } }
    case 'setSearchResultList':
      return { ...state, ...{ getSearchResultList } }
    case 'setHotArticleDetail':
      return { ...state, ...{ hotArticleDetail } }
    case 'setSearchResultDetail':
      return { ...state, ...searchResultDetail }
    default:
      return state
  }
}
// 搜索文章列表
const getSearchListSaga = (dispatch) => async (keywords) => {
  const getSearchResultList = await getSearchResultListApi(keywords)
  dispatch({ type: 'setgetSearchResultList', getSearchResultList })
}
// // 热门文章列表
// const getHotArticleListSaga=(dispatch) => async (id) => {
//   const articleDetail = await getHotArticleListApi(id)
//   dispatch({ type: 'setArticleDetail', articleDetail })
// }
// 热门文章详情
const getHotArticleDetailSaga = (dispatch) => async (id) => {
  const hotArticleDetail = await getHotArticleDetailApi(id)
  dispatch({ type: 'setHotArticleDetail', hotArticleDetail })
}
// 搜索文章详情
const getSearchResultDetailSaga = (dispatch) => async (id) => {
  const searchResultDetail = await getSearchArticleDetailApi(id)
  dispatch({ type: 'setSearchResultDetail', searchResultDetail })
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
    getHotArticleDetailApi()
      .then(hotArticleDetail=>{
        dispatch({type:'setHotArticleDetail',hotArticleDetail})
      })
      .catch(err=>{
        console.log(err,'fetch hot detail err')
      })
  }, [])
  return {
    ...state,
    ...{ getSearchList: getSearchListSaga(dispatch) },
    ...{ getHotArticleDetail: getHotArticleDetailSaga(dispatch) },
    ...{ getSearchArticleDetail: getSearchResultDetailSaga(dispatch) }
  }
}
export const ContextProvider = ({ children }) => {
  return <context.Provider value={combineSagas()}>{children}</context.Provider>
}
