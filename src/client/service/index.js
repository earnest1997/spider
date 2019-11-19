import { get } from 'util/http'

/**
 * 获取热门文章
 */
export const getHotArticleListApi = async (
  startIndex,
  requestCount
) => {
  return get(
    `/getHotArticleList?startIndex=${startIndex}&requestCount=${requestCount}`
  )
}
/**
 * 获取搜索结果
 * @param {*} keywords
 */
export const getsearchListApi = async (keywords) => {
  return get('/getsearchList', { keywords })
}
/**
 * 获取文章详情
 * @param {*} id
 * @param {*} type
 */
export const getArticleDetailApi = async (id, type) => {
  return get('/getArticleDetail', { id, type })
}
// /**
//  * 获取搜索文章详情
//  * @param {*} id
//  */
// export const getSearchArticleDetailApi= async (id) =>{
//   return get('/searchArticleDetailList',{id})
// }
