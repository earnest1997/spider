import {get,post} from '../../util/http'


export const getHotArticles=()=>{
get('/hotArticles').then(data=>{
  const {hotArticleList=[]}=data
})
}

export const getSearchResult= ()