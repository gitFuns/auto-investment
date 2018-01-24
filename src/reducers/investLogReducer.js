import * as ActionType from '../actions/actionTypes'

export function getInvestLogList (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_LOG:
      return action.investLogList
    default:
      return state
  }
}
