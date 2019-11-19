import {
  getsearchListApi,
  getHotArticleListApi,
  getArticleDetailApi
} from '@/service'

export const article = (state, action) => {
  const {
    type,
    hotArticleList,
    searchList,
    articleDetail,
    hotListLength,
    stateAfterClean
  } = action
  switch (type) {
    case 'setHotArticleList':
      return { ...state, ...{ hotArticleList, hotListLength } }
    case 'setsearchList':
      return { ...state, ...{ searchList } }
    case 'setArticleDetail':
      return { ...state, ...{ articleDetail } }
    case 'cleanData':
    return stateAfterClean
    default:
      return state
  }
}

// 搜索文章列表
const getSearchListSaga = (state,dispatch) => async (keywords) => {
  window.sessionStorage.clear()
  const { data: searchList } = await getsearchListApi(keywords)
  if(!searchList.noData){
  window.sessionStorage.searchList=JSON.stringify(searchList)
  window.sessionStorage.keywords=keywords
  }
  dispatch({ type: 'setsearchList', searchList })
}
// 获取文章详情
const getArticleDetailSaga = (state,dispatch) => async (id, type) => {
  const { data: articleDetail } = await getArticleDetailApi(id, type)
  dispatch({ type: 'setArticleDetail', articleDetail })
}
// 获取热门文章
const getHotArticleListSaga = (state,dispatch) => async (startIndex, requestCount) => {
  const {
    data: { list:hotArticleList, total: hotListLength }
  } = await getHotArticleListApi(startIndex, requestCount)
  dispatch({ type: 'setHotArticleList',hotArticleList, hotListLength})
}

export const articleSagas = {
  getSearchList: getSearchListSaga,
  getArticleDetail: getArticleDetailSaga,
  getHotArticleList: getHotArticleListSaga
}
