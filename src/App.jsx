import React from 'react'
import { Provider } from './util/store'
import { initState } from './client/store'
import page from './client/page'
import { BrowserRouer as Router, Route } from 'react-router-dom'

export default class App extends React.Component {
  render() {
    return (
      <Provider store={initState()}>
        <Router>
          <Route component={page.Home} exact strict path="/" />
        </Router>
      </Provider>
    )
  }
}
