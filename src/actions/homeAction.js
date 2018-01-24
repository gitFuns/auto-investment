import {
  AUTO_INVESTMENT_HOME_CHECK,
  AUTO_INVESTMENT_HOME_INFO,
  AUTO_INVESTMENT_SERVICE
} from './actionTypes'

import { checkVipAsync, fetchHomeInfo, getMyService } from '../service'

function receiveVipInfo (isEnd, userAutoInvestInfo) {
  return { type: AUTO_INVESTMENT_HOME_CHECK, isEnd: isEnd, userAutoInvestInfo: userAutoInvestInfo }
}

function receiveHomeInfo (isEnd, homeInfo) {
  return { type: AUTO_INVESTMENT_HOME_INFO, isEnd: isEnd, homeInfo: homeInfo }
}

function receiveServiceInfo (isEnd, serviceInfo) {
  return { type: AUTO_INVESTMENT_SERVICE, isEnd: isEnd, serviceInfo: serviceInfo }
}

// 获取用户自动投资信息
export function getUserAutoInvestInfo () {
  return (dispatch) => {
    checkVipAsync()
      .then(data => {
        dispatch(receiveVipInfo(true, data || {}))
      })
  }
}

export function getHomeInfo (pageNo) {
  return (dispatch) => {
    fetchHomeInfo(pageNo)
      .then(data => {
        dispatch(receiveHomeInfo(true, data || {}))
      })
  }
}

export function getServiceInfo () {
  return (dispatch) => {
    getMyService()
      .then(data => {
        dispatch(receiveServiceInfo(true, data || {}))
      })
  }
}
