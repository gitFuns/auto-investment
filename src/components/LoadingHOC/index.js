import React from 'react'
import Loading from 'components/loading'

/* eslint-disable */
const LoadingHOC = (Component) => ({isLoading, ...props}) => {
  if (isLoading) {
    return <Loading />
  }

  return <Component {...props} />
}

export default LoadingHOC
