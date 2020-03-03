import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader/root'
import { App } from 'app'

const AppToRender = process.env.NODE_ENV !== 'production' ? hot(App) : App

// eslint-disable-next-line react/no-render-return-value
const renderPLS = () => ReactDOM.render(<AppToRender />, document.getElementById('root'))

if (document.readyState === 'complete') {
  renderPLS()
} else {
  window.onload = renderPLS
}
