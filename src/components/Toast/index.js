import React from 'react'
import './index.scss'

class Toast extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isShow: false, message: '' }
  }

  open = (message, delay = 1500) => {
    this.stoId && window.clearTimeout(this.stoId)
    this.setState({ message: message, isShow: true })

    this.stoId = setTimeout(() => {
      this.setState({ isShow: false })
    }, message.length > 12 ? delay * 1.2 : delay)
  }

  _handleManualClose = () => {
    window.clearTimeout(this.stoId)
    this.setState({ isShow: false })
  }

  render() {
    return (
      <div
        className={this.state.isShow ? 'ToastContainer show' : 'ToastContainer'}
        onClick={this._handleManualClose}
      >
        <div className="toast-text">{this.state.message}</div>
      </div>
    )
  }
}

export default Toast
