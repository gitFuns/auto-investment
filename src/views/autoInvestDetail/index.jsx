import React from 'react'
import PropTypes from 'prop-types'
import Loading from 'components/Loading'
import PageTitle from 'views/components/PageTitle'
import HeaderContainer from 'views/components/HeaderContainer'
import PullLoad, { STATS } from 'components/PullLoad'
import { fetchInvestDetail } from 'src/service'
import ListContainer from './ListContainer'

import './scss/index.scss'

class InvestDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      pageNo: 1,
      accountInfo: {},
      investList: [],
      hasMore: true,
      noMoreTip: '',
      offsetScrollTop: 0,
      action: STATS.init
    }
  }

  componentWillMount () {
    this._fetchData()
      .then((result) => this.setState({
        init: true,
        hasMore: result.hasMore,
        accountInfo: result.accountInfo,
        investList: result.investList,
        action: STATS.reset,
        noMoreTip: result.noMoreTip,
        offsetScrollTop: result.offsetScrollTop
      }))
      .catch(() => {})
  }

  _fetchData = () => {
    let id = this.props.match.params.id

    return fetchInvestDetail({ id: id, pageNo: this.state.pageNo })
      .then((res) => {
        let accountInfo = res.data.top
        let investList = res.data.list
        let hasMore = this.state.pageNo < res.data.list.last_page
        let noMoreTip = investList.data.length > 100 ? '自动投资记录最多可查最近100条记录' : ''
        let offsetScrollTop = accountInfo.invest_status == 0 ? 100 : 0

        return { investList, hasMore, noMoreTip, accountInfo, offsetScrollTop: offsetScrollTop }
      })
  }

  _handleAction = (action) => {
    if (action === this.state.action ||
      action === STATS.refreshing && this.state.action === STATS.loading ||
      action === STATS.loading && this.state.action === STATS.refreshing ||
      action === STATS.loading && this.state.hasMore === false) {
      return false
    }

    if (action === STATS.refreshing) {
      this.setState({ action: action, pageNo: 1 })

      this._fetchData()
        .then((result) => {
          this.setState({
            hasMore: result.hasMore,
            accountInfo: result.accountInfo,
            investList: result.investList,
            action: STATS.refreshing
          })
        })
        .then(() => {
          setTimeout(() => {
            this.setState({ action: STATS.refreshed })
          }, 100)
        })
        .catch(() => {})
    } else if (action === STATS.loading) {
      this.setState({ action: action, pageNo: this.state.pageNo + 1 })

      this._fetchData()
        .then(result => {
          let investList = this.state.investList
          investList.data = investList.data.concat(result.investList.data)

          this.setState({
            action: STATS.reset,
            hasMore: result.hasMore,
            investList: investList,
            noMoreTip: result.noMoreTip
          })
        })
        .catch(() => {})
    } else {
      this.setState({ action: action })
    }
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    let hasData = this.state.investList.total > 0
    let accountInfo = this.state.accountInfo
    let status = accountInfo.invest_status == '1'
    let isRedPacket = accountInfo.is_red_packet == '1'

    return (
      <div className="auto-invest-detail-page">
        <PageTitle title="自动投资详情" />

        <div className="detail-content">
          <PullLoad
            isBlockContainer
            downEnough={50}
            offsetScrollTop={this.state.offsetScrollTop}
            action={this.state.action}
            className="block"
            handleAction={this._handleAction}
            hasMore={this.state.hasMore}
            noMoreTip={this.state.noMoreTip}
            distanceBottom={1000}
          >
            <div className={hasData ? "pull-load-content" : "pull-load-content no-data"}>
              <div className={status ? 'invested' : 'investing'}>
                <HeaderContainer>
                  {
                    /* 使用红包 投资中 */
                    isRedPacket && !status && (
                      <div>
                        <div className="content">
                          <div>
                            <p className="txt">剩余金额(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.auto_invest_amount_surplus)}</p>
                          </div>
                          <div>
                            <p className="txt">剩余红包(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.red_packe_amount_surplus)}</p>
                          </div>
                        </div>
                        <div className="footer">— 预计{accountInfo.finish_time}前完成 —</div>
                      </div>
                    )
                  }

                  {
                    /* 使用红包 投资完成 */
                    isRedPacket && !!status && (
                      <div>
                        <div className="content">
                          <div>
                            <p className="txt">投资金额(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.auto_invest_amount)}</p>
                          </div>
                          <div>
                            <p className="txt">使用红包(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.red_packet_total_amount)}</p>
                          </div>
                          <div>
                            <p className="txt">收益(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.income_actual, true)}</p>
                          </div>
                        </div>
                        <div className="footer">— {accountInfo.finish_time}完成 —</div>
                      </div>
                    )
                  }

                  {
                    /* 使用余额 投资中 */
                    !isRedPacket && !status && (
                      <div>
                        <div className="content">
                          <div>
                            <p className="txt">剩余金额(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.auto_invest_amount_surplus)}</p>
                          </div>
                        </div>
                        <div className="footer">— 预计{accountInfo.finish_time}前完成 —</div>
                      </div>
                    )
                  }

                  {
                    /* 使用余额 完成 */
                    !isRedPacket && !!status && (
                      <div>
                        <div className="content">
                          <div>
                            <p className="txt">投资金额(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.auto_invest_amount)}</p>
                          </div>
                          <div>
                            <p className="txt">收益(元)</p>
                            <p className="amount">{this.$toThousands(accountInfo.income_actual, true)}</p>
                          </div>
                        </div>
                        <div className="footer">— {accountInfo.finish_time}完成 —</div>
                      </div>
                    )
                  }
                </HeaderContainer>
              </div>

              <ListContainer source={this.state.investList} isRedPacket={isRedPacket} />
            </div>
          </PullLoad>
        </div>
      </div>
    )
  }
}

InvestDetail.propTypes = {
  match: PropTypes.objectOf(PropTypes.any)
}

export default InvestDetail
