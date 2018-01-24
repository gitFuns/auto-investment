import { combineReducers } from 'redux'
import * as homeMod from './homeReducer'
import * as explainMod from './explainReducer'
import * as settingMod from './settingReducer'
import * as investLogMod from './investLogReducer'

const reducer = combineReducers({
  userAutoInvestInfo: homeMod.getUserAutoInvestInfo,
  homeInfo: homeMod.getHomeInfo,
  explainInfo: explainMod.getExplainInfo,
  redpacketInfo: settingMod.getRepacketInfo,
  balanceInfo: settingMod.getBalanceInfo,
  investLogList: investLogMod.getInvestLogList,
  serviceInfo: homeMod.getServiceInfo
})

export default reducer
