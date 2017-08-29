import React from 'react'
import {createRenderer} from 'fela'
import {render} from 'fela-dom'

const renderer = createRenderer()

render(renderer)

class Component extends React.Component {
  constructor (props) {
    super(props)

    this.localProperties = {}
    this._styles = this.createStyleSheet()
    this.cssHelper = this.cssHelper.bind(this)
  }

  updateStyle (props = {}) {
    Object.assign(this.localProperties, props)
    this._styles = this.createStyleSheet()
    this.forceUpdate()
  }

  createStyleSheet () {
    if (!this.style) {
      return {}
    }

    const style = this.style(this.keyframeHelper)

    if (typeof style !== 'object') {
      throw new TypeError("Template method 'styles' returns a non-object")
    }

    const _styles = {}

    for (const _class in style) {
      const className = renderer.renderRule(style[_class], {})
      // Avoid empty className for a rule with no children
      if (className.length > 0) {
        _styles[_class] = className
      }
    }

    return _styles
  }

  keyframeHelper (keyframe) {
    return renderer.renderKeyframe(keyframe, {})
  }

  cssHelper (...args) {
    const classes = args
      .map(_class => {
        if (_class && this._styles[_class]) {
          return this._styles[_class]
        }
        return null
      })
      .filter(v => Boolean(v))
    return classes.length ? classes.join(' ') : null
  }

  render () {
    if (!this.template) {
      throw new TypeError("Template doesn't define 'template' method")
    }

    return this.template(this.cssHelper)
  }
}

function hexToRGBA (hex, opacity) {
  var c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255, opacity].join(',')})`
  }
  throw new Error('Bad Hex')
}

export {Component, hexToRGBA, renderer}
