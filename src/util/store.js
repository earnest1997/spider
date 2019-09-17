import React, { useContext, useReducer, forwardRef } from 'react'

const context = useContext({})
export const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'setArticles':
      return Object.assign({}, state, payload)
    default:
      return state
  }
}
export const Provider = context.Provider
export const connect = (mapStateToProps) => (component) => {
  return forwardRef((props, ref) => {
    return (
      <context.Consumer>
        {(state) => {
          let restProps =
            typeof mapStateToProps === 'function'
              ? mapStateToProps(state, props)
              : {}
          return React.createElement(
            component,
            { ...props, ...restProps, ref },
            {}
          )
        }}
      </context.Consumer>
    )
  })
}
