/**
 * content:自动投资-余额
 * author: 王海波
 * createDate: 2017-12-18
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PageTitle from 'views/components/PageTitle'
import Loading from 'components/Loading'
import Modal from 'components/Modal'
import PageTip from 'views/components/PageTip'
import HeaderContainer from 'views/components/HeaderContainer'
import SettingBtn from 'views/components/SettingBtn'
import InvestItem from 'views/components/InvestItem'
import ErrorHandler from 'views/components/ErrorHandler'
import { doInvestment } from 'src/service'
import profitCalculator from 'src/global/calculator'
import encrypt from 'src/global/encrypt'
import { getBalanceInfo } from 'actions/settingAction'

import './index.scss'

@connect(
  state => ({
    balanceInfo: state.balanceInfo
  }),
  dispatch => ({
    getBalanceInfo: () => { dispatch(getBalanceInfo()) }
  })
)

class AutoInvestWithBalance extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      isShowPwdModal: false,
      hasError: false,
      bizCode: -9999,
      usableAmount: 0,
      settedAmount: 0,
      investInfo: {},
      tipInfo: '— 每个项目期限设置为1条设置记录 —',
      profitAmount: '',
      profitInfo: '',
      password: ''
    }
  }

  componentWillMount () {
    this.props.getBalanceInfo()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.$isEmpty(nextProps.balanceInfo)) {
      if (nextProps.balanceInfo.hasError) {
        this.setState({ init: true, hasError: true, bizCode: nextProps.balanceInfo.code })
      } else {
        this.setState({
          init: true,
          usableAmount: Math.floor(nextProps.balanceInfo.data.use_money),
          investInfo: this._initInvestInfo(nextProps.balanceInfo.data.month_rate)
        })
      }
    }
  }

  _initInvestInfo = (monthInfo) => {
    let result = {}
    Object.keys(monthInfo).reduce((result, item) => {
      result[item] = {
        id: item,
        profitAmount: 0,
        inputValue: '',
        profitInfo: '',
        rate: monthInfo[item],
        tipInfo: `预计最低年化收益${monthInfo[item]}%`,
      }

      return result
    }, result)

    return result
  }

  _handleMaxBtnClick = (investObj) => {
    Object.keys(this.state.investInfo).forEach((key) => {
      let investObj = this.state.investInfo[key]

      investObj.inputValue = ''
      investObj.profitAmount = 0
    })

    let rate = investObj.rate
    let totalAmout = Math.floor(this.props.balanceInfo.data.use_money)
    investObj.inputValue = totalAmout
    investObj.profitAmount = profitCalculator(totalAmout, rate, investObj.id)
    investObj.profitInfo = `预计最低收益${this.$toThousands(investObj.profitAmount, true)}元`

    this.setState({
      settedAmount: investObj.inputValue,
      profitAmount: investObj.profitAmount,
      profitInfo: `— ${investObj.profitInfo} —`,
      usableAmount: 0
    })
  }

  /**
   *  利用当前投资规则对象 同步页面数据
   */
  _syncPageData = (investObj) => {
    let total = 0
    let profitAmount = 0
    let usableAmount = Math.floor(this.props.balanceInfo.data.use_money)

    Object.keys(this.state.investInfo)
      .filter(item => { return item !== investObj.id })
      .forEach(item => {
        if (this.state.investInfo[item].inputValue) {
          total += Number(this.state.investInfo[item].inputValue)
          profitAmount += Number(this.state.investInfo[item].profitAmount) * 100
        }
      })

    // 边界值判断
    let diff = usableAmount - total
    let value = Math.min(investObj.inputValue, diff)

    total += value
    investObj.inputValue = value > 0 ? value : ''
    investObj.profitAmount = profitCalculator(investObj.inputValue, investObj.rate, investObj.id)
    investObj.profitInfo = `预计最低收益${this.$toThousands(investObj.profitAmount, true)}元`
    profitAmount += investObj.profitAmount * 100

    this.setState({
      investInfo: this.state.investInfo,
      usableAmount: usableAmount - total,
      settedAmount: total,
      profitAmount: profitAmount / 100,
      profitInfo: `— 预计最低收益${this.$toThousands(profitAmount / 100, true)}元 —`
    })
  }

  _handleChange = (event) => {
    let inputEle = event.target
    let inputValue = inputEle.value.replace(/,/g, '') || '0'
    let key = inputEle.dataset['index']

    if (this._isCanSetting(key)) {
      if (isNaN(inputValue)) {
        return
      }

      let investObj = this.state.investInfo[key]
      investObj.inputValue = inputValue.replace(/,/g, '')

      if (!investObj.profitAmount && this.state.usableAmount === 0) {
        investObj.inputValue = ''
        this.$toast.open('可用余额不足')

        return
      }

      this._syncPageData(investObj)
    }
  }

  _showPwdModal = () => {
    if (this.state.settedAmount === 0) {
      this.$toast.open('请输入投资金额')

      return
    }

    this.setState({ isShowPwdModal: true })
  }

  _handlePwdChange = (event) => {
    this.setState({ password: event.target.value })
  }

  _handleSettingBtnClick = () => {
    if (!this.state.password) {
      this.$toast.open('请输入交易密码')

      return
    }

    let payLoad = Object.create(null)
    Object.keys(this.state.investInfo).reduce((result, item) => {
      let value = this.state.investInfo[item].inputValue
      if (value > 0) {
        result[item] = Object.create(null)
        result[item].value = value
      }

      return result
    }, payLoad)

    return doInvestment({
      type: 0,
      password: encrypt(this.state.password),
      redpacket_list: payLoad
    }).then(() => {
      this.props.history.push('/')
    }).catch(() => {})
  }

  _isCanSetting = (index) => {
    let result = true
    let balanceInfo = this.props.balanceInfo.data
    let maxNum = balanceInfo.allow_set_num - balanceInfo.has_set_num

    if (maxNum < Object.keys(balanceInfo.month_rate).length) {
      let investedList = Object.keys(this.state.investInfo)
        .filter((key) => key !== index)
        .map((key) => this.state.investInfo[key])
        .filter(item => !!item.inputValue)

      if (maxNum <= investedList.length) {
        this.$toast.open('您已达到最大自动投资数')
        result = false
      }
    }

    return result
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    if (this.state.hasError) {
      return (
        <ErrorHandler
          code={this.state.bizCode}
          path={this.props.history.location.pathname}
          onClose={() => this.props.history.push('/')}
        />)
    }

    let investInfo = this.state.investInfo

    return (
      <div className="auto-invest-with-balance-page">
        <PageTitle title="自动投资设置" />
        <PageTip />

        <HeaderContainer>
          <div>
            <ul className="list">
              <li className="list-item">
                <p className="list-item-title">可用余额(元)</p>
                <p className="list-item-value">{this.$toThousands(this.state.usableAmount)}</p>
              </li>
              <li className="list-item">
                <p className="list-item-title">设置金额(元)</p>
                <p className="list-item-value">{this.$toThousands(this.state.settedAmount)}</p>
              </li>
            </ul>
            <div className="header-footer">
              {this.state.profitAmount > 0 ? this.state.profitInfo : this.state.tipInfo}
            </div>
          </div>
        </HeaderContainer>


        <div className="invest-list-container">
          {
            Object.keys(investInfo).map((item, index) => {
              return (
                <InvestItem
                  key={item}
                  btnTxt="最大"
                  index={(index + 1).toString()}
                  onBtnClick={() => this._handleMaxBtnClick(investInfo[item])}
                >
                  <div>
                    <input
                      type="text"
                      data-index={item}
                      onChange={this._handleChange}
                      placeholder="请输入自动投资金额"
                      value={this.$toThousands(investInfo[item].inputValue)}
                    />

                    <p className="profit-info">
                      {investInfo[item].profitAmount ? investInfo[item].profitInfo : investInfo[item].tipInfo}
                    </p>
                  </div>
                </InvestItem>
              )
            })
          }
        </div>

        <SettingBtn onClick={this._showPwdModal} />

        <Modal
          type="dialog"
          isShow={this.state.isShowPwdModal}
          title="请输入交易密码"
          positiveBtnTxt="确定"
          onNegative={() => this.setState({ isShowPwdModal: false, password: '' })}
          onPositive={this._handleSettingBtnClick}
        >
          <div>
            <div style={{height: "0", overflow: "hidden"}}>
              <input type="password" style={{height: "0"}}  />
            </div>
            <input type="password" placeholder="请输入交易密码" onChange={this._handlePwdChange} value={this.state.password} />
          </div>
        </Modal>
      </div>
    )
  }
}

AutoInvestWithBalance.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  balanceInfo: PropTypes.objectOf(PropTypes.object),
  getBalanceInfo: PropTypes.func
}

export default AutoInvestWithBalance
