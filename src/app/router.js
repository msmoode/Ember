import React from 'React'
import toRegex from 'path-to-regexp'
import createHistory from 'history/lib/createBrowserHistory'

export default class Router extends React.Component {

  matchURI (path, uri) {
    const keys = []
    const pattern = toRegex(path, keys) // TODO: Use caching
    const match = pattern.exec(uri)
    if (!match) return null
    const params = Object.create(null)
    for (let i = 1; i < match.length; i++) {
      params[keys[i - 1].name] =
        match[i] !== undefined ? match[i] : undefined
    }
    return params
  }

  async resolve (routes, context) {
    for (const route of routes) {
      const uri = context.error ? '/error' : context.pathname
      const params = this.matchURI(route.path, uri)
      if (!params) continue
      const result = await route.action({ ...context, params })
      if (result) return result
    }
    const error = new Error('Not found')
    error.status = 404
    throw error
  }

  componentDidMount () {
    const history = createHistory()
    history.listen(this.onLocationChange)
    this.onLocationChange(history.getCurrentLocation)
  }

  onLocationChange (location) {
    this.resolve(this.props.routes, location)
      .then(this.updateReact)
  }

  updateReact (component) {
    this.currentComponent = component
    this.forceUpdate()
  }

  render () {
    return this.currentComponent
  }
}
