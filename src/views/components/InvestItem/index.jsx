import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

class InvestItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = { pending: false }
  }

  _handleBtnClick = () => {
    if (!this.props.onBtnClick || this.state.pending === true) {
      return
    }

    return Promise.resolve()
      .then(() => {
        this.setState({ pending: true })

        return this.props.onBtnClick(this.props.index)
      })
      .then(() => this.setState({ pending: false }))
      .catch((error) => {
        this.setState({ pending: false })

        error && this.$toast.open(error.message || '未知错误')
      })
  }

  render () {
    return (
      <div className="InvestItemContainer">
        <div className="left">
          <p>{this.props.index}</p>
          <p>个月</p>
        </div>
        <div className="middle">
          {this.props.children}
        </div>
        <div className="right" onClick={this._handleBtnClick}>
          <a>{this.props.btnTxt}</a>
        </div>
      </div>
    )
  }
}

InvestItem.propTypes = {
  index: PropTypes.string,
  btnTxt: PropTypes.string,
  onBtnClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element
  ]),
}

export default InvestItem
