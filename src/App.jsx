import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ContextProvider } from '@/client/store'
import * as page from '@/client/page'
import { Header } from '@/client/components'
import { ErrorBoundary } from '@/client/page'
import '@/client/style/index.scss'

export const App = () => {
  return (
    <ErrorBoundary>
      <ContextProvider>
        <Router>
          <Header />
          <Switch>
            <Route exact strict path='/' component={page.Home}/>
            <Route exact strict path='/search/article/:id' component={page.Article} />
            <Route path='/hot/article/:id' component={page.Article} />
            <Route path='/search' component={page.Search}/>
            <Route path='*' component={page.NotFound}/>
          </Switch>
        </Router>
      </ContextProvider>
    </ErrorBoundary>
  )
}
