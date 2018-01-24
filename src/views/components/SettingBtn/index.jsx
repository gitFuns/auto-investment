import React from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const STATUS = {
  INIT: 0,
  PENDING: 1,
  RESOLVE: 2
}

class SettingBtn extends React.Component {
  constructor (props) {
    super(props)

    this.state = { btnTxt: '确认设置', status: STATUS.INIT }
  }

  handleClick = () => {
    if (!this.props.onClick || this.state.status === STATUS.PENDING) {
      return
    }

    return Promise.resolve()
      .then(() => {
        this.setState({ btnTxt: '请稍等...', status: STATUS.PENDING })

        return this.props.onClick()
      })
      .then(() => {
        this.setState({ btnTxt: '确认设置', status: STATUS.RESOLVE })
      })
      .catch(error => {
        this.setState({ btnTxt: '确认设置', status: STATUS.RESOLVE })

        error && this.$toast.open(error.message || '接口异常')
      })
  }

  render () {
    return (
      <div className="SettingBtnContainer">
        <div className="text" onClick={this.handleClick}>{this.state.btnTxt}</div>
      </div>
    )
  }
}

SettingBtn.propTypes = {
  onClick: PropTypes.func
}

export default SettingBtn
