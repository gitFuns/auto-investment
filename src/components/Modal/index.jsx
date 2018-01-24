import React from 'react'
import PropTypes from 'prop-types'
import Btn from 'components/Btn'

import './index.scss'

class Modal extends React.Component {
  render() {
    let modalFooter = null
    if (this.props.type === 'dialog') {
      modalFooter = (
        <div>
          <Btn onClick={this.props.onNegative}>{this.props.negativeBtnTxt || '取消'}</Btn>
          <Btn onClick={this.props.onPositive}>{this.props.positiveBtnTxt || '确认'}</Btn>
        </div>
      )
    } else {
      modalFooter = (
        <div>
          <Btn onClick={this.props.onNegative}>{this.props.negativeBtnTxt || '确定'}</Btn>
        </div>
      )
    }

    return (
      <div className={this.props.isShow ? "ModalContainer" : "ModalContainer close"}>
        <div className="modal">
          <div className="modal-header">{this.props.title || '温馨提示'}</div>
          <div className="modal-content">{this.props.children}</div>
          <div className="modal-footer">
            {modalFooter}
          </div>
        </div>
      </div>
    )
  }
}

Modal.propTypes = {
  type: PropTypes.string,
  title: PropTypes.string,
  isShow: PropTypes.bool,
  onNegative: PropTypes.func,
  onPositive: PropTypes.func,
  negativeBtnTxt: PropTypes.string,
  positiveBtnTxt: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
}

export default Modal
