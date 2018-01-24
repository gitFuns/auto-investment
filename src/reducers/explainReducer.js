import * as ActionType from '../actions/actionTypes'

export function getExplainInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_EXPLAIN:
      return action.explainInfo
    default:
      return state
  }
}
