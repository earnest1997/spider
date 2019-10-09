import React, { createContext, forwardRef } from 'react'

const context = createContext({})
export const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'setArticles':
      return Object.assign({}, state, payload)
    default:
      return state
  }
}
// simple redux based on context

export const Provider = context.Provider

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

