/**
 * content:自动投资-红包
 * author: 王海波
 * createDate: 2017-12-18
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Loading from 'components/Loading'
import Modal from 'components/Modal'
import PageTitle from 'views/components/PageTitle'
import PageTip from 'views/components/PageTip'
import HeaderContainer from 'views/components/HeaderContainer'
import InvestItem from 'views/components/InvestItem'
import SettingBtn from 'views/components/SettingBtn'
import { getRepacketInfo } from 'actions/settingAction'
import ErrorHandler from 'views/components/ErrorHandler'
import { checkRedpacketData, doInvestment } from 'src/service'
import encrypt from 'src/global/encrypt'
import bridge from 'src/global/bridge'

import RedPacketListModal from './RedPackListModal'
import RedPacketRuleModel from './redPacketRuleModel'

import './scss/index.scss'

@connect(
  state => ({
    redpacketInfo: state.redpacketInfo
  }),
  dispatch => ({
    getRepacketInfo: () => { dispatch(getRepacketInfo()) }
  })
)

class AutoInvestWithRedPacket extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      isShow: false,
      profitAmount: 0,
      usableAmount: 0,
      settedAmount: 0,
      profitInfo: '',
      password: '',
      isShowPwdModal: false,
      isShowRechargeModal: false,
      hasError: false,
      bizCode: -9999,
      tipInfo: '— 每个项目期限设置为1条设置记录 —',
      currentRule: {},
      redPacketRuleList: []
    }
  }

  componentWillMount () {
    this.props.getRepacketInfo()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.$isEmpty(nextProps.redpacketInfo)) {
      if (nextProps.redpacketInfo.hasError) {
        this.setState({ init: true, hasError: true, bizCode: nextProps.redpacketInfo.code })
      } else {
        this._fillDataWithProps(nextProps)
      }
    }
  }

  _fillDataWithProps (props) {
    let cid = 0
    let valueMap = {}
    let redpacketInfo = props.redpacketInfo.data

    Object.keys(props.redpacketInfo.data.month_rate).forEach((key) => {
      valueMap[key] = { redpacket_num: 0 }
    })

    let redPacketList = redpacketInfo.red_list.map((item) => {
      return {
        ...item,
        id: ++cid,
        valueMap: JSON.parse(JSON.stringify(valueMap)),
        left_num: item.num
      }
    })

    let redPacketRuleList = []
    Object.keys(redpacketInfo.month_rate).forEach((key) => {
      redPacketRuleList.push(new RedPacketRuleModel({
        ruleId: key,
        rate: redpacketInfo.month_rate[key],
        redPacketList: redPacketList,
        maxRedPacketNum: redpacketInfo.allow_set_red_num,
        showTip: this.$toast.open,
        render: (model) => this.setState({ currentRule: model})
      }))
    })

    this.setState({
      init: true,
      redPacketRuleList: redPacketRuleList,
      usableAmount: redpacketInfo.use_red_packet_money
    })
  }

  _handleSelectBtnClick = (ruleId) => {
    let selectedRedpacketNum = 0
    let redpacketInfo = this.props.redpacketInfo.data
    let ruleMaxNum = redpacketInfo.allow_set_num - redpacketInfo.has_set_num
    let redpacketMaxNum = redpacketInfo.allow_set_red_num
    let ruleItem = this.state.redPacketRuleList.filter((item) => item.id === ruleId)[0]
    let selectedRuleList = this.state.redPacketRuleList.filter((item) => item.settingAmount > 0)

    if (ruleItem.totalRedPacketNum === 0 && selectedRuleList.length >= ruleMaxNum) {
      this.$toast.open('您已达到最大自动投资数')

      return
    }

    if (selectedRuleList.length > 0) {
      selectedRuleList.forEach((item) => {
        selectedRedpacketNum += item.totalRedPacketNum
      })

      if (ruleItem.totalRedPacketNum === 0 && selectedRedpacketNum >= redpacketMaxNum) {
        this.$toast.open('您已达到最大红包设置个数')

        return
      }
    }

    ruleItem.setMaxNum(redpacketMaxNum - selectedRedpacketNum)
    this.setState({ isShow: true, currentRule: ruleItem })

    this.$scrollEnhancer()
  }

  _handleSelectedRedPacket = () => {
    this.$scrollEnhancer()

    let settedAmount = 0
    let profitAmount = 0
    let redPacketAmount = 0

    this.state.redPacketRuleList.filter(item => !!item.totalRedPacketNum)
      .forEach((item) => {
        settedAmount += item.settingAmount
        profitAmount += item.profitAmount * 100
        redPacketAmount += item.redPacketAmount
      })

    profitAmount = this.$toThousands(profitAmount / 100, true)

    let usableAmount = this.props.redpacketInfo.data.use_red_packet_money - settedAmount
    let profitInfo = `— 预计最少收益${profitAmount}元, 使用红包${this.$toThousands(redPacketAmount)}元 —`

    this.setState({
      isShow: false,
      profitAmount: profitAmount,
      usableAmount: usableAmount,
      settedAmount: this.$toThousands(settedAmount),
      profitInfo: profitInfo,
      redPacketRuleList: this.state.redPacketRuleList
    })
  }

  _showPwdModal = () => {
    if (this.state.settedAmount === 0) {
      this.$toast.open('请先设置投资金额')

      return
    }

    if (this.state.usableAmount < 0) {
      this.setState({ isShowRechargeModal: true })

      return
    }

    let payLoad = {}

    this.state.redPacketRuleList
      .filter(item => !!item.totalRedPacketNum)
      .forEach((item) => {
        payLoad = Object.assign(payLoad, item.genPayload())
      })

    /* 用户选择红包是否有效 */
    return checkRedpacketData(payLoad)
      .then((res) => {
        if (res.hasError) {

          this.setState({
            hasError: true,
            bizCode: res.code,
            settedAmount: 0,
            profitAmount: 0
          }, () => this.props.getRepacketInfo())
        } else {
          this.setState({ isShowPwdModal: true })
        }
      })
  }

  _handlePwdChange = (event) => {
    this.setState({ password: event.target.value })
  }

  _handleRecharge = () => {
    bridge.goRecharge()
  }

  _handleConfrimSetting = () => {
    if (!this.state.password) {
      this.$toast.open('请输入交易密码')

      return
    }

    let payLoad = {}
    this.state.redPacketRuleList
      .filter(item => !!item.totalRedPacketNum)
      .forEach((item) => {
        payLoad = Object.assign(payLoad, item.genPayload())
      })

    return doInvestment({
      type: 1,
      password: encrypt(this.state.password),
      redpacket_list: payLoad
    }).then(() => {
      this.props.history.push('/')
    }).catch(() => {})
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    let hasError = this.state.hasError

    return (
      <div className="auto-invest-with-red-packet-page">
        <PageTitle title="自动投资设置" />

        <PageTip />

        <HeaderContainer>
          <div>
            <ul className="list">
              <li className="list-item">
                <p className="list-item-title">红包可用金额(元)</p>
                <p className="list-item-value">{this.$toThousands(this.state.usableAmount)}</p>
              </li>
              <li className="list-item">
                <p className="list-item-title">设置金额(元)</p>
                <p className="list-item-value">{this.state.settedAmount}</p>
              </li>
            </ul>
            <div className="header-footer">
              {this.state.profitAmount > 0 ? this.state.profitInfo : this.state.tipInfo}
            </div>
          </div>
        </HeaderContainer>

        <div className="invest-list-container">
          {
            this.state.redPacketRuleList.map((item) => {
              return (
                <InvestItem
                  key={item.id}
                  btnTxt="选择"
                  onBtnClick={this._handleSelectBtnClick}
                  index={item.id}
                >
                  {
                    item.totalRedPacketNum == 0 ?
                      (<div>
                        <p className="rate">{item.defaultTip}</p>
                        <p className="count">已选 x 0</p>
                      </div>) :
                      (<div>
                        <p className="rate">{item.profitTip}</p>
                        <p className="amount">{item.valueTip}</p>
                        <p className="count">已选 x {item.totalRedPacketNum}</p>
                      </div>)
                  }
                </InvestItem>
              )
            })
          }
        </div>

        <RedPacketListModal
          isShow={this.state.isShow}
          onPositiveBtnClick={this._handleSelectedRedPacket}
          redPacketRule={this.state.currentRule}
        />

        <SettingBtn onClick={this._showPwdModal} />

        <Modal
          type="dialog"
          isShow={this.state.isShowPwdModal}
          title="请输入交易密码"
          positiveBtnTxt="确定"
          onNegative={() => this.setState({ isShowPwdModal: false, password: '' })}
          onPositive={this._handleConfrimSetting}
        >
          <div>
            <div style={{height: "0", overflow: "hidden"}}>
              <input type="password" style={{height: "0"}}  />
            </div>
            <input type="password" placeholder="请输入交易密码" onChange={this._handlePwdChange} value={this.state.password} />
          </div>
        </Modal>

        <Modal
          type="dialog"
          isShow={this.state.isShowRechargeModal}
          positiveBtnTxt="去充值"
          onNegative={() => this.setState({ isShowRechargeModal: false })}
          onPositive={this._handleRecharge}
        >
          <div>
            <p>您当前红包可用金额小于设置金额,</p>
            <p>请重新选择红包设置获取充值~</p>
          </div>
        </Modal>

        {
          hasError &&
          <ErrorHandler
            code={this.state.bizCode}
            path={this.props.history.location.pathname}
            onClose={() => this.setState({ hasError: false })}
          />
        }
      </div>
    )
  }
}

AutoInvestWithRedPacket.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  redpacketInfo: PropTypes.objectOf(PropTypes.object),
  getRepacketInfo: PropTypes.func
}

export default AutoInvestWithRedPacket
