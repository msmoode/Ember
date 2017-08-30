import ReactDOM from 'react-dom'
import React from 'react'
import API from '../lib/api'
import Router from './router'

const mountPoint = document.getElementById('ember-mount')
const blogName = mountPoint.dataset.blogName

const blog = new API('uX0Dd9EckhKF9fhqSQysQbxYbWc5qHiZn1E1GDLm7k7f2KNV9u', blogName)

const routes = [
  {
    path: '/',
    async action ({params}) {
      const data = await blog.fetch('/info')
      return <Home data={data} />
    }
  },
  {
    path: '/2',
    async action ({params}) {
      const data = await blog.fetch('/info')
      return <Home data={data} />
    }
  }
]

class Home extends React.Component {
  render () {
    return <a>{this.props.data}</a>
  }
}

ReactDOM.render(<Router routes={routes} />, mountPoint)
