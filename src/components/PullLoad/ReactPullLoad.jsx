import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { STATS } from './constants'
import HeadNode from './HeadNode'
import FooterNode from './FooterNode'

import './ReactPullLoad.scss'

export default class ReactPullLoad extends Component {
  constructor (props) {
    super(props)

    this.state = { pullHeight: 0}
  }

  componentDidMount () {
    const { isBlockContainer, offsetScrollTop, downEnough, distanceBottom } = this.props

    this.defaultConfig = {
      container: isBlockContainer ? this.containerEle : document.body,
      offsetScrollTop: offsetScrollTop,
      downEnough: downEnough,
      distanceBottom: distanceBottom
    }

    this.containerEle.addEventListener('touchstart', this.onTouchStart, false)
    this.containerEle.addEventListener('touchmove', this.onTouchMove, false)
    this.containerEle.addEventListener('touchend', this.onTouchEnd, false)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.action === STATS.refreshed) {
      setTimeout(() => {
        this.props.handleAction(STATS.reset)
      }, 1000)
    }
  }

  componentWillUnmount () {
    this.containerEle.removeEventListener('touchstart', this.onTouchStart, false)
    this.containerEle.removeEventListener('touchmove', this.onTouchMove, false)
    this.containerEle.removeEventListener('touchend', this.onTouchEnd, false)
  }

  onPullDownMove = (data)  => {
    if (!this.canRefresh()) { return false }

    let loaderState, diff = data[0].touchMoveY - data[0].touchStartY
    if (diff < 0) {
      diff = 0
    }

    diff = this.easing(diff)

    if (diff > this.defaultConfig.downEnough) {
      loaderState = STATS.enough
    } else {
      loaderState = STATS.pulling
    }
    this.setState({
      pullHeight: diff,
    })

    this.props.handleAction(loaderState)
  }

  onPullDownRefresh = () => {
    if (!this.canRefresh()) { return false }

    if (this.props.action === STATS.pulling) {
      this.setState({pullHeight: 0})
      this.props.handleAction(STATS.reset)
    } else {
      this.setState({ pullHeight: 0 })

      this.props.handleAction(STATS.refreshing)
    }
  }

  onPullUpMove = () => {
    if (!this.canRefresh()) { return false }

    this.setState({ pullHeight: 0 })

    this.props.handleAction(STATS.loading)
  }

  onTouchStart = (event) => {
    if (!this.canRefresh()) { return false }

    if (event.touches.length === 1) {
      let targetEvent = event.changedTouches[0]

      this.startX = targetEvent.clientX
      this.startY = targetEvent.clientY
    }
  }

  onTouchMove = (event) => {
    if (!this.canRefresh()) { return false }

    let scrollTop = this.getScrollTop(),
      scrollH = this.defaultConfig.container.scrollHeight,

      conH = this.defaultConfig.container === document.body ?
        document.documentElement.clientHeight :
        this.defaultConfig.container.offsetHeight,

      targetEvent = event.changedTouches[0],
      curX = targetEvent.clientX,
      curY = targetEvent.clientY,
      diffX = curX - this.startX,
      diffY = curY - this.startY

    if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
        event.preventDefault()
        this.onPullDownMove([{
          touchStartY: this.startY,
          touchMoveY: curY
        }])
      } else if (diffY < 0 && (scrollH - scrollTop - conH) < this.defaultConfig.distanceBottom) {
        this.onPullUpMove([{
          touchStartY: this.startY,
          touchMoveY: curY
        }])
      }
    }
  }

  onTouchEnd = (event) => {
    let scrollTop = this.getScrollTop(),
      targetEvent = event.changedTouches[0],
      curX = targetEvent.clientX,
      curY = targetEvent.clientY,
      diffX = curX - this.startX,
      diffY = curY - this.startY;

    if (Math.abs(diffY) > 5 && Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY > 5 && scrollTop < this.defaultConfig.offsetScrollTop) {
        this.onPullDownRefresh();
      }
    }
  }

  getScrollTop = () => {
    if (this.defaultConfig.container) {
      if (this.defaultConfig.container === document.body) {
        return document.documentElement.scrollTop || document.body.scrollTop
      }

      return this.defaultConfig.container.scrollTop
    }

    return 0
  }

  setScrollTop = (value) => {
    if (this.defaultConfig.container) {
      let scrollH = this.defaultConfig.container.scrollHeight

      if (value < 0) { value = 0 }
      if (value > scrollH) { value = scrollH }

      return this.defaultConfig.container.scrollTop = value
    }

    return 0
  }

  easing = (distance) => {
    let t = distance
    let b = 0
    let d = screen.availHeight
    let c = d / 2.5

    return c * Math.sin(t / d * (Math.PI / 2)) + b
  }

  canRefresh = () => {
    return [STATS.refreshing, STATS.loading].indexOf(this.props.action) < 0
  }

  render () {
    const {
      children,
      action,
      hasMore,
      className,
      noMoreTip
    } = this.props

    const { pullHeight } = this.state
    const boxClassName = `${className} pull-load state-${action}`;

    const msgStyle = pullHeight ? {
      WebkitTransform: `translate3d(0, ${pullHeight}px, 0)`,
      transform: `translate3d(0, ${pullHeight}px, 0)`
    } : null

    return (
      <div className={boxClassName} ref={(ele) => this.containerEle = ele}>
        <div className="pull-load-body" style={msgStyle}>
          <div className="pull-load-head">
            <HeadNode loaderState={action} />
          </div>
          { children }
          <div className="pull-load-footer">
            <FooterNode loaderState={action} hasMore={hasMore} noMoreTip={noMoreTip} />
          </div>
        </div>
      </div>
    )
  }
}

/**
 * action 用于同步状态
 * handleAction 用于处理状态
 * hasMore 是否还有更多内容可加载
 * offsetScrollTop 必须大于零，使触发刷新往下偏移，隐藏部分顶部内容
 * downEnough 下拉满足刷新的距离
 * distanceBottom 距离底部距离触发加载更多
 */
ReactPullLoad.propTypes = {
  action: PropTypes.string.isRequired,
  handleAction: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  noMoreTip: PropTypes.string,
  offsetScrollTop: PropTypes.number,
  downEnough: PropTypes.number,
  distanceBottom: PropTypes.number,
  isBlockContainer: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
    PropTypes.any
  ])
}
