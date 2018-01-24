import { AUTO_INVESTMENT_LOG } from './actionTypes'

import { getInvestLog } from '../service'

function receiveInvestLog (isEnd, investLogList) {
  return { type: AUTO_INVESTMENT_LOG, isEnd: isEnd, investLogList: investLogList }
}

export function getInvestLogList (pageNo = 1) {
  return (dispatch) => {
    getInvestLog(pageNo)
      .then(data => {
        dispatch(receiveInvestLog(true, data || {}))
      })
  }
}
