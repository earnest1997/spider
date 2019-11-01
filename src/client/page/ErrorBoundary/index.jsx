import React from 'react'
import {Error} from './Error'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }
  static getDerivedStateFromError(error) {
    console.log(error)
    return {
      hasError: true
    }
  }
  componentDidCatch(err, info) {
    console.log(err, info)
    this.setState({ hasError: true })
  }
  render() {
    const { hasError } = this.state
    const { children } = this.props
    return <>{hasError ? <Error /> : children}</>
  }
}
