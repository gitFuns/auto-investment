/**
 * content:自动投资首页
 * author: 王海波
 * createDate: 2017-11-30
 */

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import bridge from 'src/global/bridge'
import { getUserAutoInvestInfo, getHomeInfo } from 'actions/homeAction'

import Loading from 'components/Loading'
import PullLoad, { STATS } from 'components/PullLoad'
import PageTitle from 'views/components/PageTitle'
import PageTip from 'views/components/PageTip'
import HeaderContainer from 'views/components/HeaderContainer'
import PageLinker from 'views/components/PageLinker'
import InvestRecord from 'views/components/InvestRecord'
import ErrorHandler from 'views/components/ErrorHandler'

import './index.scss'

@connect(
  state => ({
    userAutoInvestInfo: state.userAutoInvestInfo,
    homeInfo: state.homeInfo
  }),
  dispatch => ({
    getUserAutoInvestInfo: () => { dispatch(getUserAutoInvestInfo()) },
    getHomeInfo: (pageNo) => { dispatch(getHomeInfo(pageNo)) }
  })
)

class AutoInvestmentHome extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      hasError: false,
      bizCode: -9999,
      pageNo: 1,
      hasMore: true,
      noMoreTip: '',
      action: STATS.init,
      investRecordList: []
    }
  }

  componentWillMount () {
    this.props.getUserAutoInvestInfo()

    this._handleFreeScroll()
  }

  /**
   * code 1: 成功 | 0: 失败 | -1: 未登录 | 2：不是自动投资vip
   * code 3 未实名，需要跳转实名 | 4 不是金额vip，需要跳转购买金融vip
   * code 5 不是超级会员，需要跳转购买超级会员 | 6 可用余额不足
   */
  componentWillReceiveProps (nextProps) {
    if (!this.$isEmpty(nextProps.userAutoInvestInfo)) {
      let bizCode = nextProps.userAutoInvestInfo.code

      this._bizCodeHandler(bizCode, nextProps)
    }
  }

  _handleFreeScroll () {
    let position = document.body.style.position

    if (position === 'fixed') {
      this.$scrollEnhancer()
    }
  }

  _bizCodeHandler = (bizCode, nextProps) => {
    if (bizCode === 1) {
      if (!this.props.getHomeInfo._invoked) {
        this.props.getHomeInfo._invoked = true
        this.props.getHomeInfo()
      } else if (!this.$isEmpty(nextProps.homeInfo)) {
        let code = nextProps.homeInfo.code
        if (code === 1) {
          let investRecordList
          let hasMore = this.state.pageNo < nextProps.homeInfo.data.invest_log.last_page

          if (this.state.pageNo === 1) {
            investRecordList = nextProps.homeInfo.data.invest_log.list
          } else {
            investRecordList = this.state.investRecordList.concat(nextProps.homeInfo.data.invest_log.list)
          }

          let noMoreTip = investRecordList.length > 100 ? '自动投资记录最多可查最近100条记录' : ''
          let action = this.state.action === 'refreshing' ? STATS.refreshed : STATS.reset

          this.setState({
            init: true,
            investRecordList: investRecordList,
            hasMore: hasMore,
            action: action,
            noMoreTip: noMoreTip
          })
        } else {
          this.setState({ init: true, hasError: true, bizCode: code })
        }
      }
    } else {
      this.setState({ init: true, hasError: true, bizCode: bizCode })
    }
  }

  _handleAction = (action) => {
    if (action === this.state.action ||
      action === STATS.refreshing && this.state.action === STATS.loading ||
      action === STATS.loading && this.state.action === STATS.refreshing ||
      action === STATS.loading && this.state.hasMore === false) {
      return false
    }

    if (action === STATS.refreshing) {
      Promise.resolve()
        .then(() => {
          this.setState({ action: action, pageNo: 1 })

          this.props.getHomeInfo._invoked = false

          return this.props.getUserAutoInvestInfo()
        })
    } else if (action === STATS.loading) {
      this.props.getHomeInfo(this.state.pageNo + 1)

      this.setState({ action: action, pageNo: this.state.pageNo + 1 })
    } else {
      this.setState({ action: action })
    }
  }

  _handleLinkBtnClick = (index) => {
    let isSetUp = this.props.homeInfo.data.is_set_up

    if (isSetUp == 0) {
      this.$toast.open(this.props.homeInfo.data.notset_up_msg)

      return
    }

    if (this.props.homeInfo.data.allow_set_num <= this.props.homeInfo.data.has_set_num) {
      this.$toast.open('您已达到最大自动投资数')

      return
    }

    let path = ['/autoInvestWithRedPacket', '/autoInvestWithBalance'][index]

    this.props.history.push(path)
  }

  _handleGoBack = () => {
    return Promise.resolve()
      .then(() => {
        bridge.goBack()

        return false
      })
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    let homeInfo = this.props.homeInfo.data

    if (this.state.hasError) {
      return (
        <ErrorHandler
          code={this.state.bizCode}
          path={this.props.history.location.pathname}
        />)
    }

    let hasData = this.state.investRecordList.length > 0

    return (
      <div className="auto-inveset-home-page">
        <PageTitle goBack={this._handleGoBack} title="自动投资设置" />

        <PageTip />

        <div className="detail-content">
          <PullLoad
            isBlockContainer
            downEnough={50}
            offsetScrollTop={100}
            action={this.state.action}
            className={hasData ? "block" : "block no-data"}
            handleAction={this._handleAction}
            hasMore={this.state.hasMore}
            noMoreTip={this.state.noMoreTip}
            distanceBottom={1000}
          >
            <div className="pull-load-content">
              <HeaderContainer>
                <ul className="list">
                  <li className="list-item">
                    <p className="list-item-title">可用余额(元)</p>
                    <p className="list-item-value">{this.$toThousands(homeInfo.use_money)}</p>
                  </li>
                  <li className="list-item">
                    <p className="list-item-title">可用红包(个)</p>
                    <p className="list-item-value">{this.$toThousands(homeInfo.red_packet_total_num)}</p>
                  </li>
                  <li className="list-item">
                    <p className="list-item-title">可用红包金额(元)</p>
                    <p className="list-item-value">{this.$toThousands(homeInfo.use_red_packet_money)}</p>
                  </li>
                </ul>
              </HeaderContainer>

              <div className="btn-container">
                <div
                  onClick={() => this._handleLinkBtnClick(0)}
                  className="btn btn-red-packet"
                  style={{display: homeInfo.red_packet_total_num == "0" ? 'none' : 'block'}}
                >
                  使用红包自动投资
                </div>

                <div
                  onClick={() => this._handleLinkBtnClick(1)}
                  className="btn btn-balance"
                >
                  不使用红包自动投资
                </div>
              </div>

              <PageLinker
                showLeft={false}
                leftLinkUrl="/customerService"
                leftLinkText="我的服务"
                leftLinkIcon={require('views/components/PageLinker/service.png')}
                rightLinkUrl="/autoInvestExplain"
                rightLinkText="遇到问题"
                rightLinkIcon={require('views/components/PageLinker/helper.png')}
              />

              <div className="invest-record-container">
                {
                  this.state.investRecordList.map((item) => {
                    return (
                      <Link to={`/autoInvestDetail/${item.id}`} key={item.id}>
                        <InvestRecord {...item} />
                      </Link>
                    )
                  })
                }
              </div>
            </div>
          </PullLoad>
        </div>
      </div>
    )
  }
}

AutoInvestmentHome.propTypes = {
  history: PropTypes.objectOf(PropTypes.any),
  homeInfo: PropTypes.objectOf(PropTypes.object),
  userAutoInvestInfo: PropTypes.objectOf(PropTypes.object),
  getHomeInfo: PropTypes.func,
  clearHomeInfo: PropTypes.func,
  getUserAutoInvestInfo: PropTypes.func
}

export default AutoInvestmentHome
