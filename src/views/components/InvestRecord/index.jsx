import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './index.scss'

const InvestRecord = (props) => {
  return (
    <div className="InvestListContainer">
      <div className={props.invest_status == 0 ? "invest-list-item investing" : "invest-list-item invested"}>
        <div className="item-header">
          <span>{props.create_time}</span>
          <span className="duration">项目期限: {props.auto_invest_item_term_month}个月</span>
          <span className="arrow-right" />
        </div>
        <div className="item-container">
          <div className="item-content">
            <p className="amount">{Component.prototype.$toThousands(props.auto_invest_amount)}</p>
            <p>金额(元)</p>
          </div>

          <div className="item-content">
            <p className="red-packet">{(props.red_packet_total_amount)}</p>
            <p>红包(元)</p>
          </div>

          <div className="item-content">
            { props.invest_status == 0 ?
              <div>
                <p className="profit">{Component.prototype.$toThousands(props.income_plan, true)}</p>
                <p>预计收益(元)</p>
              </div> :
              <div>
                <p className="profit">{Component.prototype.$toThousands(props.income_actual, true)}</p>
                <p>收益(元)</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

InvestRecord.propTypes = {
  create_time: PropTypes.string,
  auto_invest_item_term_month: PropTypes.string,
  red_packet_total_amount: PropTypes.string,
  auto_invest_amount: PropTypes.string,
  income_plan: PropTypes.string,
  income_actual: PropTypes.string,
  invest_status: PropTypes.string
}

export default InvestRecord
