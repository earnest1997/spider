import {
  getSearchResultApi,
  getHotArticlesApi,
  getArticleDetailApi
} from '@/client/api'
import React, { useEffect, useReducer, createContext } from 'react'

export const context = createContext({})
const reducers = (state, action) => {
  const { type, hotArticlesList, searchResultList, articleDetail } = action
  switch (type) {
    case 'setHotArticleList':
      return { ...state, ...{ hotArticlesList } }
    case 'setSearchResultList':
      return { ...state, ...{ searchResultList } }
    case 'setArticleDetail':
      return { ...state, ...{ articleDetail } }
    default:
      return state
  }
}
const getSearchListSaga = (dispatch) => async (keywords) => {
  const searchResultList = await getSearchResultApi(keywords)
  dispatch({ type: 'setSearchResultList', searchResultList })
}

const getArticleDetailSaga = (dispatch) => async (id) => {
  const articleDetail = await getArticleDetailApi(id)
  console.log(articleDetail,89)
  dispatch({ type: 'setArticleDetail', articleDetail })
}

function combineSagas() {
  const initialState = {
    hotArticlesList: [],
    searchResultList: [],
    articleDetail: {}
  }
  const [state, dispatch] = useReducer(reducers, initialState)
  useEffect(() => {
    getHotArticlesApi().then((data) => {
      console.log(data,'dat')
      const { hotArticlesList } = data
      dispatch({ type: 'setHotArticleList', hotArticlesList })
    }).catch(err=>{console.log(err,'fetchhot err')})
  }, [])
  return {
    state,
    ...{ getSearchList: getSearchListSaga(dispatch) },
    ...{ getArticleDetail: getArticleDetailSaga(dispatch) }
  }
}
export const ContextProvider = ({ children }) => {
  return <context.Provider value={combineSagas()}>{children}</context.Provider>
}

