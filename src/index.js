import React from 'react'
import {render} from 'react-dom'
import {App} from './App'
import 'ionicons/dist/css/ionicons.min.css'
import 'ionicons/dist/ionicons.js'
// import 'bin/run'

render(
  <React.Fragment>
   <App />
   </React.Fragment>,
  document.getElementById('rootEle')
)
