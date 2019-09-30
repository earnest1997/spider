import {get,post} from 'util/http'


export const getHotArticlesApi=async()=>{
return get('/hotArticlesList')
}

// export const getSearchResult= ()