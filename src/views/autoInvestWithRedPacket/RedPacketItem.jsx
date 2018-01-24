import React from 'react'
import PropTypes from 'prop-types'

import './scss/redPacketItem.scss'

class RedPackertItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = { redpacketNum: '' }
  }

  componentWillReceiveProps (nextProps) {
    let redpacketNum = nextProps.valueMap[nextProps.ruleId].redpacket_num

    this.setState({ redpacketNum: redpacketNum })
  }

  _handleIncreaseBtnClick = () => {
    if (!this.props.onIncrease) {
      return
    }

    Promise.resolve()
      .then(() => this.props.onIncrease(this.props.id))
      .catch(error => {
        error && this.$toast.open(error.message || '未知错误')
      })
  }

  _handleReduceBtnClick = () => {
    if (!this.props.onReduce) {
      return
    }

    Promise.resolve()
      .then(() => this.props.onReduce(this.props.id))
      .catch(error => {
        error && this.$toast.open(error.message || '未知错误')
      })
  }

  _handleSelectAll = () => {
    if (!this.props.onSelectAll) {
      return
    }

    Promise.resolve()
      .then(() => this.props.onSelectAll(this.props.id))
      .catch(error => {
        error && this.$toast.open(error.message || '未知错误')
      })
  }

  _handleInput = (event) => {
    if (!this.props.onInput) {
      return
    }

    event.persist()
    this.setState({ redpacketNum: event.target.value }, () => {
      Promise.resolve()
        .then(() => this.props.onInput(this.props.id, this.state.redpacketNum))
        .catch(error => {
          error && this.$toast.open(error.message || '未知错误')
        })
    })
  }

  render () {
    return (
      <div className="RedPacketItemContainer">
        <div className="left">
          <p>
            <span>￥</span>{parseFloat(this.props.value)}
          </p>
          <p>满{parseFloat(this.props.user_constraint)}可用</p>
        </div>
        <div className="center">
          <p className="txt">有效至{this.props.end_time}</p>
          <div className="content">
            <span
              className={this.state.redpacketNum > 0 ? 'btn reduce' : 'btn reduce disable'}
              onClick={this._handleReduceBtnClick}
            ><i />
            </span>
            <input
              type="text"
              className="count"
              value={this.state.redpacketNum === 0 ? '' : this.state.redpacketNum}
              onInput={this._handleInput}
            />
            <span
              className={this.props.left_num > 0 ? 'btn increase' : 'btn increase disable'}
              onClick={this._handleIncreaseBtnClick}
            >
              <i /><i />
            </span>
          </div>
          <p className="txt">共{this.props.left_num}个</p>
        </div>
        <div className="right" onClick={this._handleSelectAll}><a>最大</a></div>
      </div>
    )
  }
}

RedPackertItem.propTypes = {
  id: PropTypes.number,
  ruleId: PropTypes.string,
  left_num: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueMap: PropTypes.objectOf(PropTypes.object),
  value: PropTypes.string,
  user_constraint: PropTypes.string,
  end_time: PropTypes.string,
  onIncrease: PropTypes.func,
  onReduce: PropTypes.func,
  onInput: PropTypes.func,
  onSelectAll: PropTypes.func
}

export default RedPackertItem
