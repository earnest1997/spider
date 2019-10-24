import React from 'react'
import { ContextProvider } from '@/client/store'
import * as page from '@/client/page'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import '@/client/style/index.scss'
import {Header} from '@/client/components'

export const App = () => {
  return (
    <ContextProvider>
    <Router>
      <Header/>
      <Switch>
          <Route component={page.Home} exact strict path='/' />
          <Route component={page.Article} path='/article/:id'/>
          <Route component={page.Search} path='/search'/>
      </Switch>
    </Router>
    </ContextProvider>
  )
}
