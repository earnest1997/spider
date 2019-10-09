import {get,post} from 'util/http'


export const getHotArticlesApi=async()=>{
return get('/hotArticlesList')
}

export const getSearchResultApi= async(keywords)=>{
return get('/searchResultList',{keywords})
}

export const getArticleDetailApi= async (id) =>{
return get('/getArticleDetail',{id})
}