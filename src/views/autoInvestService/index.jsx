/**
 * content:自动投资服务
 * author: 王海波
 * createDate: 2017-12-19
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import bridge from 'src/global/bridge'

import Modal from 'components/Modal'
import Loading from 'components/Loading'
import PageTitle from 'views/components/PageTitle'
import PageLinker from 'views/components/PageLinker'
import PageRemark from 'views/components/PageRemark'
import { getServiceInfo } from 'actions/homeAction'
import { openAutoInvest } from 'src/service'
import encrypt from 'src/global/encrypt'

import './index.scss'

@connect(
  state => ({
    serviceInfo: state.serviceInfo
  }),
  dispatch => ({
    getServiceInfo: () => { dispatch(getServiceInfo()) },
  })
)

class AutoInvestService extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      password: '',
      isRenew: false,
      modalContent: '',
      isOpenSuccess: false,
      isShowPwdModal: false
    }
  }

  componentWillMount () {
    this.props.getServiceInfo()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.serviceInfo) {
      this.setState({ init: true })
    }
  }

  _handleRecharge = () => {
    bridge.goRecharge()
  }

  _handleShowPwdModal = () => {
    let modalContent = (<div>
      <p>有效期最后一天的18点后</p>
      <p>不允许开启或关闭自动续费</p>
    </div>)

    this.setState({ isShowPwdModal: true, modalContent: modalContent })
  }

  _handlePwdChange = (event) => {
    this.setState({ password: event.target.value })
  }

  _handleOpenVip = () => {
    if (!this.state.password) {
      this.$toast.open('请输入交易密码')

      return
    }

    let payLoad = {}
    payLoad.password = encrypt(this.state.password)
    payLoad.isRenew = this.state.isRenew === true ? 1 : 0

    return openAutoInvest(payLoad)
      .then((res) => {
        if (res.code === 1) {
          this.setState({ isOpenSuccess: true })
        }
      })
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    let userInfo = this.props.serviceInfo.data
    return (
      <div className="auto-invest-service-page">
        <PageTitle title="自动投资服务" />

        <div className="account-info">
          <div className="left">
            开通账户: <span className="uname">{userInfo.user_name}</span>
          </div>
          <div className="right">
            可用余额:
            <span className="balance">
              {this.$toThousands(Math.floor(userInfo.use_money))}
            </span>
            <span className="recharge" onClick={this._handleRecharge}>充值 &gt;</span>
          </div>
        </div>

        <div className="content">
          <div className="i-checked" />
          <div className="month">一个月</div>
          <div className="cost">￥{userInfo.cost_money}</div>
        </div>

        <div className="auto-renew" onClick={() => this.setState({ isRenew: !this.state.isRenew })}>
          <label htmlFor="isAutoRenew">
            <input type="checkbox" id="isAutoRenew" className="checkbox" />
            自动续费
          </label>
        </div>

        <div className="btn-confirm" onClick={this._handleShowPwdModal}>确定</div>
        <PageLinker
          leftLinkUrl="/customerService"
          leftLinkText="我的服务"
          leftLinkIcon={require('views/components/PageLinker/service.png')}
          rightLinkUrl="/autoInvestList"
          rightLinkText="历史设置"
          rightLinkIcon={require('views/components/PageLinker/record.png')}
        />

        <PageRemark />

        <Modal
          type="dialog"
          isShow={this.state.isShowPwdModal}
          title="请输入交易密码"
          positiveBtnTxt="确定"
          onNegative={() => this.setState({ isShowPwdModal: false, password: '' })}
          onPositive={this._handleOpenVip}
        >
          <div>
            {this.state.modalContent}
            <div style={{height: "0", overflow: "hidden"}}>
              <input type="password" style={{height: "0"}}  />
            </div>
            <input type="password" placeholder="请输入交易密码" value={this.state.password} onChange={this._handlePwdChange} />
          </div>
        </Modal>

        <div className={this.state.isOpenSuccess ? 'open-success' : 'open-success close'}>
          <div className="content">
            <p className="success-tip">您已成功开通</p>
            <p className="success-tip1">
              <span className="high-light">超级会员专属</span>自动投资
            </p>
            <p className="success-tip2">请尽情享受您的 超级会员专属</p>
            <p className="success-tip3">自动投资之旅吧 !</p>

            <div className="success-btn" onClick={() => this.props.history.push('/')}>立即体验</div>
          </div>
        </div>
      </div>
    )
  }
}

AutoInvestService.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  serviceInfo: PropTypes.objectOf(PropTypes.object),
  getServiceInfo: PropTypes.func
}

export default AutoInvestService
