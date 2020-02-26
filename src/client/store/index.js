import React, { useReducer, createContext, forwardRef } from 'react'
import { article, articleSagas } from './article'

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
    return hasChanged ? Object.assign({}, state, nextState) : state
  }
}

const rootReducers = combineReducers({ article })

const initialState = {
article: {}}
function combineSagas(sagas) {
  const [state, dispatch] = useReducer(rootReducers, initialState) //eslint-disable-line
  let finalSagas = {}
  for (let key in sagas) {
    finalSagas[key] = async function(...arg){
      const stateKey=key.substr(3).replace(/\w{1}/,$1=>$1.toLowerCase())
      const stateAfterClean=Reflect.deleteProperty(state,stateKey)
      dispatch({type:'cleanData',stateAfterClean})
     const req= sagas[key].call(null,state, dispatch)
     return req.apply(null,arg)
    }
  }
  
  return {
    ...state,
    ...finalSagas
  }
}

export const ContextProvider = ({ children }) => {
  const rootSagas = combineSagas({ ...articleSagas })
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
            return React.createElement(component, { ...props, ref })
          })()
        }
      </context.Consumer>
    )
  })
