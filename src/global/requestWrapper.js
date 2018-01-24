import axios from 'axios'
import qs from 'querystring'
import { Component } from 'react'
import bridge from 'src/global/bridge'

axios.defaults.baseURL =  DEBUG ? 'https://wh.yatang.cn/api/' : `${window.location.origin}/api/`

const toast = Component.prototype.$toast

const AUTHSTR = 'itbt_57e406a8f5ef5649f75abf6e6d7318b26047a466'

let authenticationString = ''

/* eslint-disable */
export function requestWrapper (url, payload = {}) {
  if (!authenticationString) {
    return bridge.getAuthStr()
      .then((result) => {
        if (result) {
          authenticationString = result
        } else {
          authenticationString = qs.parse(window.location.search.slice(1)).auth ||  AUTHSTR
          toast.open('获取用户信息失败, 使用测试帐号')
        }

        payload = { ...payload, authenticationString: authenticationString }
      })
      .then(() => _sendRequest(url, payload))
      .catch(() => {})
  } else {
    payload = { ...payload, authenticationString: authenticationString }

    return _sendRequest(url, payload)
  }

  function _sendRequest (url, payload) {
    return axios.post(url, qs.stringify(payload))
      .then((res) => {
        if (res.data.status === false && res.data.code === 0) {
          throw new Error(res.data.message)
        } else if (res.data.code !== 1) {
          return {
            ...res.data,
            hasError: true
          }
        } else {
          return res.data
        }
      })
      .catch((error) => {
        toast.open(error.message || '接口异常')

        error && console.error(error)

        return Promise.reject(error)
      })
  }
}
