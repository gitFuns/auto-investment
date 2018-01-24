function fnWrapper (fn) {
  let platform

  function _init () {
    let userAgent = window.navigator.userAgent.toLowerCase()

    if (/(iPhone|iPad|iPod|iOS)/i.test(userAgent)) {
      platform = 'ios'
    } else if (userAgent.match(/Android/i) && userAgent.match(/Android/i)[0] === 'android') {
      platform = 'android'
    } else {
      platform = 'other'
    }
  }

  return function () {
    if (!platform) {
      _init ()
    }

    return fn.call(null, platform)
  }
}

/* 充值 */
function goRecharge (platform) {
  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[goRecharge]`)
  }

  if (platform === 'android' && window.itbt) {
    window.itbt.toNativeActivity('cn.yt.itbt.client.activity.myaccount.ItbtWepayActivity', true)
  } else if (platform === 'ios' && window.YTJingRong ) {
    window.YTJingRong.rechargeAction()
  }
}

/* 结束当前webview */
function goBack (platform) {
  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[goBack]`)
  }

  if (platform === 'android' && window.itbt) {
    window.itbt.finished()
  } else if (platform === 'ios' && window.YTJingRong) {
    window.YTJingRong.goPageUp()
  }
}

/* 是实名认证 */
function goRealName (platform) {
  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[goRealName]`)
  }

  if (platform === 'android' && window.itbt) {
    window.itbt.toNativeActivity('cn.yt.itbt.client.activitys.index.RealNameActivity', true)
  } else if (platform === 'ios' && window.YTJingRong) {
    window.YTJingRong.goToAutonym()
  }
}

/* 续费金融vip */
function goRenewVip (platform) {
  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[goRenewVip]`)
  }

  if (platform === 'android' && window.itbt) {
    window.itbt.toNativeActivity('cn.yt.itbt.client.activity.myaccount.chest.RenewVipActivity', true)
  } else if (platform === 'ios' && window.YTJingRong) {
    window.YTJingRong.buyFinancialVip()
  }
}

/* 购买超级会员 */
function goSuperVip (platform) {
  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[goSuperVip]`)
  }

  if (platform === 'android' && window.itbt) {
    window.itbt.toSvipView()
  } else if (platform === 'ios' && window.YTJingRong) {
    window.YTJingRong.toSvipView()
  }
}

/* 获取登录字符串 */
function getAuthStr (platform) {
  bridge._retryCount = bridge._retryCount || 0

  if (DEBUG) {
    console.log(`bridge call native ${platform} method --[getAuthStr]`)
  }

  return Promise.resolve()
    .then(() => {
      if (platform === 'android' && window.itbt) {
        return Promise.resolve(window.itbt.getAuthentication(true))
      } else if (platform === 'ios') {
        return Promise.resolve()
          .then(() => {
            return new Promise((resolve) => {
              setTimeout(() => resolve(), 100)
            })
          })
          .then(() => {
            if (window.YTJingRong && window.YTJingRong.getAuthentication) {
              window.YTJingRong.getAuthentication()

              return window.bridge.authenticationString
            } else if (++bridge._retryCount < 4) {

              return getAuthStr('ios')
            }
          })
      }
    })
}

const bridge = Object.create(null)

bridge.goRecharge = fnWrapper(goRecharge)
bridge.goBack = fnWrapper(goBack)
bridge.goRealName = fnWrapper(goRealName)
bridge.goRenewVip = fnWrapper(goRenewVip)
bridge.goSuperVip = fnWrapper(goSuperVip)
bridge.getAuthStr = fnWrapper(getAuthStr)

export default bridge
