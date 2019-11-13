import React, { useReducer, createContext, forwardRef } from 'react'
import {article,articleSagas} from './article'

export const context = createContext()

/**
 *
 * @param {object} reducers
 */
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const reducerVals = Object.values(reducers)
  if (reducerVals.some((item) => typeof item !== 'function')) {
    throw new Error('invalid reducer')
  }
  return (state, action) => {
    let hasChanged = false
    let nextState = {}
    for (let key of reducerKeys) {
      const reducer = reducers[key]
      const prevStateForKey = state[key]
      const nextStateForKey = reducer(prevStateForKey, action)
      hasChanged = prevStateForKey !== nextStateForKey
      nextState[key] = nextStateForKey
    }
    console.log( Object.assign({},state,nextState),state,'sate',hasChanged)
    return hasChanged ? Object.assign({},state,nextState) : state
  }
}

const rootReducers=combineReducers({article})

const initialState = {
  article:{
  hotArticleList: [],
  searchResultList: [],
  articleDetail: { title: '', content: '', author: '' }
  }
}
function combineSagas(sagas) {
  const [state, dispatch] = useReducer(rootReducers, initialState) //eslint-disable-line
  let finalSagas={}
  for(let key in sagas){
    const saga=sagas[key](dispatch)
   finalSagas[key]=saga
  }
  return {
    ...state,
    ...finalSagas
  }
}


export const ContextProvider = ({ children }) => {
  const rootSagas=combineSagas({...articleSagas})
  return <context.Provider value={rootSagas}>{children}</context.Provider>
}

export const connect = (mapStateToProps) => (component) =>
  forwardRef((props, ref) => {
    return (
      <context.Consumer>
        {(initialState) =>
          (() => {
            if (typeof mapStateToProps === 'function') {
              props = { ...props, ...mapStateToProps(initialState, props) }
            }
            console.log(props, 'opp')
            return React.createElement(component, { ...props, ref })
          })()
        }
      </context.Consumer>
    )
  })
