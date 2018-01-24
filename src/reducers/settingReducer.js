import * as ActionType from '../actions/actionTypes'

export function getRepacketInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_RED_PACKET:
      return action.redpacketInfo
    default:
      return state
  }
}

export function getBalanceInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_BALANCE:
      return action.balanceInfo
    default:
      return state
  }
}
