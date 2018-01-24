import {
  AUTO_INVESTMENT_RED_PACKET,
  AUTO_INVESTMENT_BALANCE
} from './actionTypes'

import { fetchUseRedpacketInfo, fetchNoRedpacketInfo } from '../service'

function receiveRedpacketInfo (isEnd, redpacketInfo) {
  return { type: AUTO_INVESTMENT_RED_PACKET, isEnd: isEnd, redpacketInfo: redpacketInfo }
}

function receiveBalanceInfo (isEnd, balanceInfo) {
  return { type: AUTO_INVESTMENT_BALANCE, isEnd: isEnd, balanceInfo: balanceInfo }
}

export function getRepacketInfo () {
  return (dispatch) => {
    fetchUseRedpacketInfo()
      .then(data => {
        dispatch(receiveRedpacketInfo(true, data || {}))
      })
  }
}

export function getBalanceInfo () {
  return (dispatch) => {
    fetchNoRedpacketInfo()
      .then(data => {
        dispatch(receiveBalanceInfo(true, data || {}))
      })
  }
}
