import React from 'react'

import './index.scss'

class Loading extends React.Component {
  constructor (props) {
    super(props)

    this.state = { isReady: false }
  }

  componentWillMount () {
    this._sto = setTimeout(() => {
      if (this.state.isReady === false) {
        this.setState({ isReady: true })
      }
    }, 500)
  }

  componentWillUnmount () {
    clearTimeout(this._sto)
  }

  render () {
    if (this.state.isReady) {
      return (
        <div className="Loading">
          <p>
            <i className="loading-icon" />
            <span className="loading-text">加载中...</span>
          </p>
        </div>
      )
    }

    return null
  }
}

export default Loading
