import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import PageTitle from 'views/components/PageTitle'
import InvestRecord from 'views/components/InvestRecord'
import Loading from 'components/Loading'
import PullLoad, { STATS } from 'components/PullLoad'

import { connect } from 'react-redux'
import { getInvestLogList } from 'actions/investLogAction'

import './index.scss'

@connect(
  state => ({
    investLogList: state.investLogList
  }),
  dispatch => ({
    getInvestLogList: (pageNo) => { dispatch(getInvestLogList(pageNo)) }
  })
)

class AutoInvestList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      init: false,
      total: 0,
      pageNo: 1,
      hasMore: true,
      action: STATS.init,
      investLogList: []
    }
  }

  componentWillMount () {
    this.props.getInvestLogList()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.$isEmpty(nextProps.investLogList)) {
      let total = nextProps.investLogList.data.total
      let hasMore = this.state.pageNo < nextProps.investLogList.data.last_page
      let investLogList = this.state.investLogList.concat(nextProps.investLogList.data.list)

      this.setState({
        init: true,
        total: total,
        investLogList: investLogList,
        hasMore: hasMore,
        action: STATS.reset
      })
    }
  }

  _handleAction = (action) => {
    if (action === this.state.action ||
      action === STATS.refreshing && this.state.action === STATS.loading ||
      action === STATS.loading && this.state.action === STATS.refreshing ||
      action === STATS.loading && this.state.hasMore === false) {
      return false
    }

    this.props.getInvestLogList(this.state.pageNo + 1)
    this.setState({ action: action, pageNo: this.state.pageNo + 1 })
  }

  render () {
    if (!this.state.init) {
      return <Loading />
    }

    return (
      <div className="auto-invest-list-page">
        <PageTitle title="历史设置" />

        <div className={this.state.total == 0 ? 'list-container no-data' : 'list-container'}>
          {
            this.state.total > 0 && (
              <PullLoad
                downEnough={150}
                action={this.state.action}
                className="block"
                handleAction={this._handleAction}
                hasMore={this.state.hasMore}
                distanceBottom={1000}
              >
                <div className="invest-record-container">
                  {
                    this.state.investLogList.map((item) => {
                      return (
                        <Link to={`/autoInvestDetail/${item.id}`} key={item.id}>
                          <InvestRecord key={item.id} {...item} />
                        </Link>
                      )
                    })
                  }
                </div>
              </PullLoad>
            )
          }
        </div>
      </div>
    )
  }
}

AutoInvestList.propTypes = {
  investLogList: PropTypes.objectOf(PropTypes.object),
  getInvestLogList: PropTypes.func
}

export default AutoInvestList
