import {getCollects,postCollect} from '@/service'

export const collect=(state,action)=>{
  const {type,collectId}=action
  let {collects}=state
  collects.push(collectId)
  switch(type){
    case 'addCollect':
    return {...state,collects}
    default:
    return state
  }
}

const postCollectSaga=(state,dispatch)=>(collectName)=>{

}