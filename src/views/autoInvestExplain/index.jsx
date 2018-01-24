/**
 * content:自动投资说明页
 * author: 王海波
 * createDate: 2017-12-18
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getExplainInfo } from 'actions/explainAction'

import Loading from 'components/Loading'
import PageTitle from 'views/components/PageTitle'

import './index.scss'

const ARTICLE_ID = 3648

@connect(
  state => ({
    explainInfo: state.explainInfo
  }),
  dispatch => ({
    getExplainInfo: (articleId) => { dispatch(getExplainInfo(articleId)) }
  })
)

class AutoInvestExplain extends Component {
  constructor (props) {
    super(props)

    this.state = { init: false, title: '' }
  }

  componentWillMount () {
    this.props.getExplainInfo(ARTICLE_ID)
  }

  componentWillReceiveProps (nextProps) {
    if (!this.$isEmpty(nextProps.explainInfo)) {
      this.setState({ init: true, title: nextProps.explainInfo.data.title }, () => {
        this.container.innerHTML += nextProps.explainInfo.data.info
      })
    }
  }

  render() {
    if (!this.state.init) {
      return <Loading />
    }


    return (
      <div className="auto-invest-explain-page">
        <PageTitle title="自动投资说明页" />

        <div className="content-wrapper" ref={(ele) => this.container = ele}>
          <p className="title">{this.state.title}</p><br />
        </div>
      </div>
    )
  }
}

AutoInvestExplain.propTypes = {
  explainInfo: PropTypes.objectOf(PropTypes.object),
  getExplainInfo: PropTypes.func
}


export default AutoInvestExplain
