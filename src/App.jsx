import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  withRouter
} from 'react-router-dom'
import { ContextProvider } from '@/store'
import * as page from '@/page'
import cp from '@/components'
import { ErrorBoundary } from '@/page'
import '@/style/common.scss'

const { Header, BackToTop, Footer } = cp

const ListenRouteChange = withRouter(({ location })=> {
  React.useEffect(()=>{
    cp.Modal.destroyAll()
  },[location])
 
  return <></>
})

export const App = () => {
  return (
    <ErrorBoundary>
      <ContextProvider>
        <Router>
          <React.Fragment>
            <ListenRouteChange />
            <Switch>
              <Route path='/404' component={page.NotFound} />
              <React.Fragment>
                <Header />
                <BackToTop />
                <Switch>
                  <Route exact strict path='/' component={page.Home} />
                  <Route
                    exact
                    strict
                    path='/search/article/:id'
                    component={page.Article}
                  />
                  <Route path='/hot/article/:id' component={page.Article} />
                  <Route path='/search' component={page.Search} />
                  <Route path='*' render={() => <Redirect to='/404' />} />
                </Switch>
                <Footer />
              </React.Fragment>
            </Switch>
          </React.Fragment>
        </Router>
      </ContextProvider>
    </ErrorBoundary>
  )
}
