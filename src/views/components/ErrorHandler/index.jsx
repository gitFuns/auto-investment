import React from 'react'
import bridge from 'src/global/bridge'
import Modal from 'components/Modal'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

class ErrorHandler extends React.Component {
  constructor (props) {
    super(props)

    this.state = { content: '', btnTxt: '', type: "" }
  }

  componentWillMount () {
    let modalContent
    let bizCode = this.props.code

    if (bizCode === -1) {
      this.setState({ content: '用户未登录或登录过期' })
    }

    if (bizCode === 3) {
      modalContent = (
        <div className="content">
          <p>抱歉，自动投资需实名认证用户才能购买！</p>
          <p>立即去实名认证~</p>
        </div>
      )

      this.setState({
        content: modalContent,
        btnTxt: '去实名',
        type: 'dialog'
      })
    }

    if (bizCode === 4) {
      modalContent = (
        <div className="content">
          <p>抱歉，自动投资需金融VIP用户才能购买！</p>
          <p>立即开通金融VIP~</p>
        </div>
      )

      this.setState({
        content: modalContent,
        btnTxt: '立即购买',
        type: 'dialog'
      })
    }

    if (bizCode === 5) {
      modalContent = (
        <div className="content">
          <p>抱歉，自动投资需超级会员才能购买！</p>
          <p>立即开通超级会员~</p>
        </div>
      )

      this.setState({
        content: modalContent,
        btnTxt: '立即购买',
        type: 'dialog'
      })
    }

    if (bizCode === 6) {
      this.setState({ content: ' 可用余额不足', btnTxt: '去充值', type: 'dialog' })
    }

    if (bizCode === 7) {
      modalContent = (
        <div className="content">
          <p>抱歉您选择的红包已使用或已过期</p>
          <p>请重新选择</p>
        </div>
      )

      this.setState({ content: modalContent })
    }
  }

  _handleNegative = () => {
    if (this.props.path === '/index' || this.props.path === '/') {
      bridge.goBack()
    } else {
      this.props.onClose && this.props.onClose()
    }
  }

  _handlePositive = () => {
    this.props.onClose && this.props.onClose()

    if (this.props.code === 3) {
      bridge.goRealName()
    }

    if (this.props.code === 4) {
      bridge.goRenewVip()
    }

    if (this.props.code === 5) {
      bridge.goSuperVip()
    }

    if (this.props.code === 6) {
      bridge.goRecharge()
    }
  }

  render () {
    if (this.props.code === 2) {
      return <Redirect to={'/openAutoInvest'} />
    }

    return (
      <div className="ErrorHandlerContainer">
        <Modal
          isShow
          type={this.state.type}
          onPositive={this._handlePositive}
          onNegative={this._handleNegative}
          positiveBtnTxt={this.state.btnTxt}
        >
          {this.state.content}
        </Modal>
      </div>
    )
  }
}

ErrorHandler.propTypes = {
  code: PropTypes.number,
  path: PropTypes.string,
  onClose: PropTypes.func
}

export default ErrorHandler
