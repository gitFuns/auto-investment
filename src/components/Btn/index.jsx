import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

class Btn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {isLoading: false}
  }

  _genClassList(className = 'default') {
    className = className.replace(/\w/, ($0) => $0.toUpperCase())

    return `Button Button${className}`
  }

  handleClick = () => {
    let returnValue = null

    if (this.props.isDisabled || this.state.isLoading) {
      return
    }

    if (this.type === 'submit') {
      // nothing
    }

    if (this.props.onClick) {
      returnValue = this.props.onClick()
    }

    if (returnValue && typeof returnValue.then === 'function') {
      this.setState({ isLoading: true })

      returnValue
        .catch(err => {
          if (DEBUG) {
            setTimeout(() => { throw err }, 0)
          }
        })
        .then(() => {
          this.setState({ isLoading: false })
        })
    }
  }

  render() {
    return (
      <div onClick={this.handleClick} className={this._genClassList(this.props.mode)}>
        <input
          type="submit"
          className="button-submit"
          style={{display: this.props.type === 'submit' ? 'inherit' : 'none'}}
        />
        {this.props.children}
      </div>
    )
  }
}

Btn.propTypes = {
  type: PropTypes.string,
  mode: PropTypes.string,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
}

export default Btn
