import * as ActionType from '../actions/actionTypes'

export function getUserAutoInvestInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_HOME_CHECK:
      return action.userAutoInvestInfo
    default:
      return state
  }
}

export function getHomeInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_HOME_INFO:
      return action.homeInfo
    default:
      return state
  }
}

export function getServiceInfo (state = {}, action) {
  switch (action.type) {
    case ActionType.AUTO_INVESTMENT_SERVICE:
      return action.serviceInfo
    default:
      return state
  }
}
