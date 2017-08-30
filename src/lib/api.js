/* global fetch */
export default class Blog {
  constructor (apiKey, blog) {
    this.apiKey = apiKey
    this.baseUrl = `https://api.tumblr.com/v2/blog/${blog}`
  }

  serialize (obj) {
    return '?' + Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')
  }

  fetch (path, properties = {}) {
    return fetch(this.baseUrl + path + this.serialize({
      api_key: this.apiKey,
      ...properties
    }))
    .then(response => response.json())
    .then(response => response.response)
  }
}
