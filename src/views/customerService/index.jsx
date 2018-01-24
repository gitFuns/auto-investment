/**
 * content:自动投资我的服务
 * author: 王海波
 * createDate: 2017-12-19
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import bridge from 'src/global/bridge'

import Modal from 'components/Modal'
import Loading from 'components/Loading'
import ErrorHandler from 'views/components/ErrorHandler'
import { getServiceInfo } from 'actions/homeAction'
import PageTitle from 'views/components/PageTitle'
import HeaderContainer from 'views/components/HeaderContainer'
import PageRemark from 'views/components/PageRemark'
import encrypt from 'src/global/encrypt'
import { toggleRenewStatus, checkOpenVip } from 'src/service'

import './index.scss'

@connect(
  state => ({
    serviceInfo: state.serviceInfo
  }),
  dispatch => ({
    getServiceInfo: () => { dispatch(getServiceInfo()) },
  })
)

class CustomerService extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      isShowPwdModal: false,
      modalContent: null,
      password: '',
      hasError: false,
      bizCode: -999,
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

  _handlePwdChange = (event) => {
    this.setState({ password: event.target.value })
  }

  _handleToogleRenew = () => {
    if (!this.state.password) {
      this.$toast.open('请输入交易密码')

      return
    }

    let tip
    let payLoad = {}
    let serviceInfo = this.props.serviceInfo.data
    payLoad.password = encrypt(this.state.password)

    if (serviceInfo.auto_invest_vip.is_auto_renew == 1) {
      payLoad.isRenew = 0
      tip = '自动续费已取消'
    } else {
      payLoad.isRenew = 1
      tip = '自动续费成功'
    }

    return toggleRenewStatus(payLoad)
      .then((res) => {
        if (res.code === 1) {
          this.$toast.open(tip)

          this.setState({
            password: '',
            isShowPwdModal: false
          }, () => this.props.getServiceInfo())
        }
      }).catch(() => {})
  }

  _handleShowPwdModal = () => {
    let modalContent = null
    let autoInvestVipInfo =  this.props.serviceInfo.data.auto_invest_vip

    if (autoInvestVipInfo.is_auto_renew == 1) {
      modalContent = (
        <div>
          <p>您当前正在关闭自动投资自动续费功能，</p>
          <p>关闭后将不再进行自动续费</p>
        </div>
      )
    } else {
      modalContent = (
        <div>
          <p>您正在开通自动投资自动续费功能，</p>
          <p>有效期最后一天的18点后不允许关闭自动续费</p>
        </div>
      )
    }

    this.setState({ isShowPwdModal: true, modalContent: modalContent})
  }

  _handleVipRenew = () => {
    bridge.goRenewVip()
  }

  _handleSVipRenew = () => {
    if (this.props.serviceInfo.data.super_vip.is_renew == 1) {
      bridge.goSuperVip()
    }
  }

  _handleOpenOrRenewVip = () => {
    let serviceInfo = this.props.serviceInfo.data
    if (serviceInfo.auto_invest_vip.sdate) {
      this.props.history.push('/autoInvestService')
    } else {
      checkOpenVip().then(res => {
        if (res.code === 1) {
          this.props.history.push('/autoInvestService')
        } else {
          this.setState({ hasError: true, bizCode: res.code })
        }
      }).catch(() => {})
    }
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    let serviceInfo = this.props.serviceInfo.data
    return (
      <div className="customer-service-page">
        <PageTitle title="我的服务" />

        <HeaderContainer>
          <div>
            <img className="avatar" src={serviceInfo.icon}  alt="" />
            <p className="uname">{serviceInfo.user_name}</p>
          </div>
        </HeaderContainer>

        <div className="rights-wrapper">
          <p className="title">— 我已享有以下特权 —</p>
          {
            serviceInfo.jr_vip &&
              <div className="rights-item border">
                <p className="rights-name">金融VIP</p>
                <p className="rights-time-info">
                  {serviceInfo.jr_vip.vip_rank > 7 ? '永久有效' : `过期时间: ${serviceInfo.jr_vip.edate}`}
                </p>
                <span
                  onClick={this._handleVipRenew}
                  className={serviceInfo.jr_vip.vip_rank > 7 ? 'hide' : 'btn btn-renew'}
                >续费</span>
              </div>

          }

          {
            !!serviceInfo.super_vip.is_vip &&
              <div className="rights-item border">
                <p className="rights-name">超级会员</p>
                <p className="rights-time-info">
                  起止时间: {serviceInfo.super_vip.sdate} 至 {serviceInfo.super_vip.edate}
                </p>

                <span
                  onClick={this._handleSVipRenew}
                  className={serviceInfo.super_vip.is_renew == 1 ? 'btn btn-renew' : 'btn btn-renew disable'}
                >
                  续费
                </span>
              </div>
          }

          {
            serviceInfo.auto_invest_vip &&
              <div className="rights-item">
                <p className="rights-name">自动投资</p>
                {
                  serviceInfo.auto_invest_vip.sdate &&
                  <div>
                    <p className="rights-time-info">
                      起止时间: {serviceInfo.auto_invest_vip.sdate} 至 {serviceInfo.auto_invest_vip.edate}
                    </p>
                    <div className="rights-status">
                      <span>自动续费:</span>
                      {
                        serviceInfo.auto_invest_vip.is_auto_renew == 1 &&
                        <p>
                          <span>已开通</span>
                          <span className="btn-link" onClick={this._handleShowPwdModal}>关闭自动续费</span>
                        </p>
                      }
                      {
                        serviceInfo.auto_invest_vip.is_auto_renew == 0 &&
                        <p>
                          <span>未开通</span>
                          <span className="btn-link" onClick={this._handleShowPwdModal}>立即开通</span>
                        </p>
                      }
                    </div>
                  </div>
                }

                {!serviceInfo.auto_invest_vip.sdate && <p className="rights-status">未开通</p>}

                <span className="btn btn-open" onClick={this._handleOpenOrRenewVip}>
                  {serviceInfo.auto_invest_vip.sdate ? '续费' : '立即开通'}
                </span>
              </div>
          }
        </div>

        <PageRemark />

        <Modal
          type="dialog"
          isShow={this.state.isShowPwdModal}
          title="请输入交易密码"
          positiveBtnTxt="确定"
          onNegative={() => this.setState({ isShowPwdModal: false, password: '' })}
          onPositive={this._handleToogleRenew}
        >
          <div>
            {this.state.modalContent}
            <div style={{height: "0", overflow: "hidden"}}>
              <input type="password" style={{height: "0"}}  />
            </div>
            <input type="password" placeholder="请输入交易密码" value={this.state.password} onChange={this._handlePwdChange} />
          </div>
        </Modal>

        {
          this.state.hasError && <ErrorHandler
            code={this.state.bizCode}
            path={this.props.history.location.pathname}
            onClose={() => this.setState({ hasError: false })}
          />
        }
      </div>
    )
  }
}

CustomerService.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  serviceInfo: PropTypes.objectOf(PropTypes.object),
  getServiceInfo: PropTypes.func
}

export default CustomerService
