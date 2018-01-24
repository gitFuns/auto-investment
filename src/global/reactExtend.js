import React from 'react'

React.Component.prototype.$isEmpty = function (obj) {
  if (obj === undefined || obj === null) {
    return true
  }

  let str = JSON.stringify(obj)
  if (str === '[]' || str === '{}') {
    return true
  }

  return false
}

React.Component.prototype.$toThousands = function (number, isDecimal) {
  if (!number) {
    return number
  }

  let decimalStr = ''

  if (isDecimal) {
    let tmpArray = number.toString().split('.')

    if (tmpArray.length > 1) {
      decimalStr = `.${tmpArray[1]}`.substring(0, 3)
    }
  }

  return `${Math.floor(number).toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')}${decimalStr}`
}

React.Component.prototype.$scrollEnhancer = function () {
  let bodyEle = document.body
  let documentEle = document.documentElement
  let position = bodyEle.style.position
  let top = bodyEle.scrollTop || documentEle.scrollTop

  if (position !== 'fixed') {
    bodyEle._top = top

    bodyEle.style.top = -top + 'px'
    bodyEle.style.position = 'fixed'
  } else {
    bodyEle.setAttribute('style', '')

    bodyEle.scrollTop = bodyEle._top
    documentEle.scrollTop = bodyEle._top
  }
}
