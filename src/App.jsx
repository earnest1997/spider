import React from 'react'
import { Provider } from 'util/store'
import { initState } from './client/store'
import * as page from './client/page'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './client/style/index.scss'

export const App = () => {
  return (
    <Router>
      <Switch>
        <Provider value={initState()}>
          <Route component={page.Home} exact strict path='/' />
          <Route component={page.Article} path='/article:id'/>
        </Provider>
      </Switch>
    </Router>
  )
}
