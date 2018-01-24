import React from 'react'
import Bundle from './bundle'

export const bundleComponent = (Component) => (props) => (
  <Bundle load={Component}>
    {(Component) => <Component {...props} /> }
  </Bundle>
)
