import request from 'request'
import Q from 'Q'

function promiseRequest (options) {
  const deferred = Q.defer()

  request(options, (err, res, body) => {
    if (err) deferred.reject(err)
    else deferred.resolve(body)
  })

  return deferred
}

export default class Blog {
  constructor (apiKey, blog) {
    this.apiKey = apiKey
    this.baseUrl = `https://api.tumblr.com/v2/blog/${blog}`
  }

  fetch (path, properties = {}) {
    return promiseRequest({
      url: this.baseUrl + path,
      qs: {
        api_key: this.apiKey,
        ...properties
      }
    })
  }
}
