import { requestWrapper } from 'src/global/requestWrapper'

/* 判断是否已开通自动投资服务 */
export const checkVipAsync = () => {
  return requestWrapper('Autoinvest/checkVip')
}

/* 获取自动投资说明信息 */
export const fetchHelpInfo = (articleId) => {
  return requestWrapper('Autoinvest/getExplain', { aid: articleId })
}

/* 获取设置首页信息 */
export const fetchHomeInfo = (pageNo = 1) => {
  return requestWrapper('Autoinvest/getHomePageInfo', { current_page: pageNo })
}

/* 获取使用红包投资信息 */
export const fetchUseRedpacketInfo = () => {
  return requestWrapper('Autoinvest/useRedpacket')
}

/* 获取使用余额投资信息 */
export const fetchNoRedpacketInfo = () => {
  return requestWrapper('Autoinvest/noRedpacket')
}

/* 确认能否开通自动投资 */
export const checkOpenVip = () => {
  return requestWrapper('Autoinvest/checkOpenVip')
}

/* 获取投资记录 */
export const getInvestLog = (pageNo) => {
  return requestWrapper('Autoinvest/getLog', { current_page: pageNo })
}

/* 获取温馨提示内容 */
export const getReminder = () => {
  return requestWrapper('Autoinvest/getReminder')
}

/* 资金转入 */
export const doInvestment = (params) => {
  return requestWrapper('Autoinvest/moneyInto', {
    is_red_packet: params.type,
    trade_password: params.password,
    redpacket_list: JSON.stringify(params.redpacket_list)
  })
}

/* 获取用户我的服务信息 */
export const getMyService = () => {
  return requestWrapper('Autoinvest/myService')
}

/* 自动续费状态切换 */
export const toggleRenewStatus = (params) => {
  return requestWrapper('Autoinvest/changeStatus', {
    trade_password: params.password,
    is_auto_renew: params.isRenew
  })
}

/* 开通自动投资服务 */
export const openAutoInvest = (params) => {
  return requestWrapper('Autoinvest/openVip', {
    trade_password: params.password,
    is_auto_renew: params.isRenew
  })
}

/* 获取投资记录详情 */
export const fetchInvestDetail = (params) => {
  return requestWrapper('Autoinvest/getDetail', {
    id: params.id,
    current_page: params.pageNo
  })
}

/* 红包投资校验 */
export const checkRedpacketData = (params) => {
  return requestWrapper('Autoinvest/checkRedpacketData', { redpacket_list: JSON.stringify(params) })
}
