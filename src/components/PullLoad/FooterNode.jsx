import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { STATS } from './constants'

export default class FooterNode extends PureComponent {
  componentDidMount () {
    this._computedHeigh()
  }

  componentWillReceiveProps () {
    this._computedHeigh()
  }

  _computedHeigh = () => {
    let clientHeight = document.documentElement.clientHeight
    let headerHeight = document.querySelector('.PageTitleContainer').scrollHeight
    let contentHeight = document.querySelector('.pull-load-body').scrollHeight + headerHeight

    this._isOver = contentHeight >= clientHeight
  }

  render () {
    const { loaderState, hasMore, noMoreTip } = this.props

    let noMore = !hasMore && this._isOver
    let className = `pull-load-footer-default ${noMore ? "nomore" : ""}`

    return (
      <div className={className} data-tip={noMoreTip || '没有更多了,别扯了'}>
        {
          loaderState === STATS.loading ? <i /> : ""
        }
      </div>
    )
  }
}

FooterNode.propTypes = {
  noMoreTip: PropTypes.string,
  loaderState: PropTypes.string.isRequired,
  hasMore: PropTypes.bool.isRequired
}
