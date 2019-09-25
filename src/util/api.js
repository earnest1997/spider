import {get,post} from '../../util/http'


export const getHotArticlesApi=()=>{
return get('/hotArticles')
}

// export const getSearchResult= ()