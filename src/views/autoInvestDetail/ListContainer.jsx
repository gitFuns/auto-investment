import React from 'react'
import PropTypes from 'prop-types'

class ListContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let cid = 0

    return (
      <div className="ListContainer">
        <ul className="list-header">
          <li>投资金额(元)</li>
          {this.props.isRedPacket && <li>红包(元)</li>}
          <li>收益(元)</li>
          <li>状态</li>
        </ul>
        <ul className="list-body">
          {
            this.props.source.data.map((item) => {
              if (item.is_red_packet_use == 0) {
                item.investStatus = '投资中'
              } else if (item.is_red_packet_use == -1) {
                item.investStatus = '红包退还'
              } else {
                item.investStatus = '投资成功'
              }

              return (
                <li key={++cid}>
                  <span>{this.$toThousands(item.red_packe_invest_amount_min || item.invest_amount)}</span>
                  {this.props.isRedPacket && <span>{this.$toThousands(item.red_packe_amount)}</span>}
                  <span>{this.$toThousands(item.invest_income, true)}</span>
                  <span>{item.investStatus}</span>
                </li>
              )
            })
          }
        </ul>
      </div>
    )
  }
}

ListContainer.propTypes = {
  isRedPacket: PropTypes.bool,
  source: PropTypes.objectOf(PropTypes.any)
}

export default ListContainer
