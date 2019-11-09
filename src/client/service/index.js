import {get} from 'util/http'

/**
 * 获取热门文章
 */
export const getHotArticleListApi=async()=>{
return get('/getHotArticleList')
}
/**
 * 获取搜索结果
 * @param {*} keywords 
 */
export const getSearchResultListApi= async(keywords)=>{
return get('/getSearchResultList',{keywords})
}
/**
 * 获取文章详情
 * @param {*} id 
 * @param {*} type
 */
export const getArticleDetailApi= async (id,type) =>{
return get('/getArticleDetail',{id,type})
}
// /**
//  * 获取搜索文章详情
//  * @param {*} id 
//  */
// export const getSearchArticleDetailApi= async (id) =>{
//   return get('/searchArticleDetailList',{id})
// }