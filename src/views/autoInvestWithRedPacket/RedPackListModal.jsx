import React from 'react'
import PropTypes from 'prop-types'
import Btn from 'components/Btn'
import  RedPacketItem from './RedPacketItem'

import './scss/redPackListModal.scss'

class RedPacketListModal extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let redPacketMsg = ''
    let redPacketRule = this.props.redPacketRule
    let redPacketList = redPacketRule.redPacketList || []
    let tipInfo = `当前设置投资期限为${redPacketRule.id}个月，预计年化收益最低${redPacketRule.rate}%`

    if (redPacketRule.totalRedPacketNum > 0) {
      redPacketMsg = `— 已选${redPacketRule.totalRedPacketNum}个红包 —`
    } else {
      redPacketMsg = `— 最多可选${redPacketRule.maxRuleRedPacketNum}个红包 —`
    }

    return (
      <div className={this.props.isShow ? 'RedPacketListModalContainer' : 'RedPacketListModalContainer close'}>
        <div className="red-packet-list-wrapper">
          <div className="red-packet-list-header">
            <p className="duration">{tipInfo}</p>
            <p className="attach-info">{redPacketMsg}</p>
          </div>

          <div className="red-packet-list-content">
            {
              redPacketList.map((item) => {
                return (
                  <RedPacketItem
                    key={item.id}
                    ruleId={redPacketRule.id}
                    onIncrease={redPacketRule.increase}
                    onReduce={redPacketRule.reduce}
                    onInput={redPacketRule.input}
                    onSelectAll={redPacketRule.selectAll}
                    {...item}
                  />
                )
              })
            }
          </div>

          <div className="red-packet-list-footer" onClick={this.props.onPositiveBtnClick}>
            <Btn>确认</Btn>
          </div>
        </div>
      </div>
    )
  }
}

RedPacketListModal.propTypes = {
  isShow: PropTypes.bool,
  onPositiveBtnClick: PropTypes.func,
  redPacketRule: PropTypes.objectOf(PropTypes.any)
}

export default RedPacketListModal
