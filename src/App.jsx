import 'normalize.css'
import 'src/global/app-polyfill.css'
import 'src/global/flexible'

import React from 'react'
import 'src/global/reactExtend'

import Toast from 'components/Toast'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { routes } from './routes/index'

const App = () => {
  return (
    <Router basename="/">
      <div className="AppContainer">
        <Switch>
          {
            routes.map((route) => {
              return (
                <Route
                  key={route.key}
                  exact={route.exact}
                  path={route.path}
                  component={route.component}
                />
              )
            })
          }
        </Switch>
        <Toast ref={(toast) => React.Component.prototype.$toast = toast} />
      </div>
    </Router>
  )
}

export default App
