import React from 'react'
import { BrowserRouter as Router, Route, Switch,Redirect } from 'react-router-dom'
import { ContextProvider } from '@/store'
import * as page from '@/page'
import { Header } from '@/components'
import { ErrorBoundary } from '@/page'
import '@/style/index.scss'

export const App = () => {

  return (
    <ErrorBoundary>
      <ContextProvider>
        <Router>
          <Switch>
          <Route path='/404' component={page.NotFound} />
          <React.Fragment>
          <Header />
          <Switch>
            <Route exact strict path='/' component={page.Home}/>
            <Route exact strict path='/search/article/:id' component={page.Article} />
            <Route path='/hot/article/:id' component={page.Article} />
            <Route path='/search' component={page.Search}/>
            <Route path='*' render={()=><Redirect to='/404'/>}/>
          </Switch>
          </React.Fragment>
          </Switch>
        </Router>
      </ContextProvider>
    </ErrorBoundary>
  )
}
