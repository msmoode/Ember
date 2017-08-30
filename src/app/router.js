import React from 'react'
import toRegex from 'path-to-regexp'
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

export default class Router extends React.Component {
  constructor (props) {
    super(props)

    this.currentComponent = null

    this.onLocationChange = this.onLocationChange.bind(this)
    this.updateReact = this.updateReact.bind(this)
    this.render = this.render.bind(this)
  }

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
    history.listen(this.onLocationChange)
    this.onLocationChange(history.location)
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
