import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

class PageTitle extends React.Component {
  handleClick = () => {
    return new Promise((resolve) => {
      let type = typeof this.props.goBack
      if (type === 'undefined') {
        resolve()
      }

      if (type === 'boolean' && type === 'true') {
        resolve()
      }

      if (type === 'function') {
        let result = this.props.goBack()
        if (result === true) {
          resolve()
        } else if (typeof result.then === 'function') {
          result.then(res => {
            if (res === true) {
              resolve()
            }
          })
        }
      }
    }).then(() => {
      window.history.go(-1)
    })
  }

  render () {
    return (
      <div className="PageTitleContainer">
        <span className="btn-back" onClick={this.handleClick}>返回</span>
        <p className="page-title">{this.props.title}</p>
      </div>
    )
  }
}

PageTitle.propTypes = {
  title: PropTypes.string,
  goBack: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
  ])
}

export default PageTitle
