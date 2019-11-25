import { get,post } from 'util/http'

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

/**
 * 添加收藏
 * @param {*} id 
 * @param {*} user 
 * @param {*} collectName
 */
export const postCollect = async(id,user,collectName)=>{
  return post('/postCollect',{id,user,collectName})
}
/**
 * 获取收藏列表
 * @param {*} user 
 */
export const getCollects=async (user)=>{
  return get('/getCollecs',{user})
}
