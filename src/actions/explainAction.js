import { AUTO_INVESTMENT_EXPLAIN } from './actionTypes'
import { fetchHelpInfo } from '../service'

function receiveExplainInfo (isEnd, explainInfo) {
  return { type: AUTO_INVESTMENT_EXPLAIN, isEnd: isEnd, explainInfo: explainInfo }
}

// 获取自动投资说明信息
export function getExplainInfo (id) {
  return (dispatch) => {
    fetchHelpInfo(id)
      .then(data => {
        dispatch(receiveExplainInfo(true, data))
      })
  }
}
