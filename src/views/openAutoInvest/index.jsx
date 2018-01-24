/**
 * content:自动投资开通页面
 * author: 易梦蝶
 * createDate: 2017-12-4
 */

import React from 'react'
import PropTypes from 'prop-types'
import bridge from 'src/global/bridge'

import ErrorHandler from 'views/components/ErrorHandler'
import PageTitle from 'views/components/PageTitle'
import PageLinker from 'views/components/PageLinker'
import PageRemark from 'views/components/PageRemark'
import { checkOpenVip } from 'src/service'

import './index.scss'

class OpenAutoInvest extends React.Component {
  constructor (props) {
    super(props)

    this.state = { hasError: false, bizCode: 1}
  }

  _handleOpenVip = () => {
    return checkOpenVip().then(res => {
      if (res.code === 1) {
        this.props.history.push('/autoInvestService')
      } else {
        this.setState({ hasError: true, bizCode: res.code })
      }
    }).catch(() => {})
  }

  _handleGoBack = () => {
    return Promise.resolve()
      .then(() => {
        bridge.goBack()

        return false
      })
  }

  render () {
    let errorEle = null

    if (this.state.hasError) {
      errorEle = (
        <ErrorHandler
          code={this.state.bizCode}
          path={this.props.history.location.pathname}
          onClose={() => this.setState({ hasError: false })}
        />)
    }

    return (
      <div className="open-auto-invest-page">
        <PageTitle goBack={this._handleGoBack} title="自动投资设置" />

        <div className="img-warpper" />

        <div className="btn-open" onClick={this._handleOpenVip}>立即开通</div>

        <PageLinker
          leftLinkUrl="/customerService"
          leftLinkText="我的服务"
          leftLinkIcon={require('views/components/PageLinker/service.png')}
          rightLinkUrl="/autoInvestList"
          rightLinkText="历史设置"
          rightLinkIcon={require('views/components/PageLinker/record.png')}
        />

        <PageRemark />

        {errorEle}
      </div>
    )
  }
}

OpenAutoInvest.propTypes = {
  history: PropTypes.objectOf(PropTypes.any)
}

export default OpenAutoInvest
