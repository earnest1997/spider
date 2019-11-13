import {
  getSearchResultListApi,
  getHotArticleListApi,
  getArticleDetailApi
} from '@/service'

export const article = (state, action) => {
  const { type, hotArticleList, searchResultList, articleDetail } = action
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
  const { data: searchResultList } = await getSearchResultListApi(keywords)
  dispatch({ type: 'setSearchResultList', searchResultList })
}
// 获取文章详情
const getArticleDetailSaga = (dispatch) => async (id, type) => {
  const { data: articleDetail } = await getArticleDetailApi(id, type)
  dispatch({ type: 'setArticleDetail', articleDetail })
}
// 获取热门文章
const getHotArticleListSaga = (dispatch) => async () => {
  const { data: hotArticleList } = await getHotArticleListApi()
  dispatch({ type: 'setHotArticleList', hotArticleList })
}

export const articleSagas = {
  getSearchList: getSearchListSaga,
  getArticleDetail: getArticleDetailSaga,
  getHotArticleList: getHotArticleListSaga
}


