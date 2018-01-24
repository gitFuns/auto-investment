import 'babel-polyfill'
import React, { createElement } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import App from './App'
import store from './store'

let rootElement = document.getElementById('root')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    rootElement
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => render(createElement(App)))
}

console.log(BUILD_INFO)
