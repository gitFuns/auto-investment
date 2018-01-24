import React from 'react'
import profitCalculator from 'src/global/calculator'

const toThousands = React.Component.prototype.$toThousands

/* 红包规则描述类 */
export default class RedPacketRuleModel {

  /**
   * ruleId        规则ID
   * rate          规则利率
   * owner         规则拥有者
   * redPacketList 规则红包列表
   */
  constructor (options) {
    this.id = options.ruleId
    this.rate = options.rate
    this.redPacketList = options.redPacketList
    this.showTip = options.showTip
    this.render = options.render
    this.maxRedPacketNum = options.maxRedPacketNum

    // 该规则最多使用红包个数
    this.maxRuleRedPacketNum = 0

    // 使用红包个数
    this.totalRedPacketNum = 0

    // 使用红包金额
    this.redPacketAmount = 0

    // 设置金额
    this.settingAmount = 0

    // 预计收益金额
    this.profitAmount = 0

    this.defaultTip = `预计年化收益最低${this.rate}%`

    // 预计收益提示语
    this.profitTip = `设置${this.settingAmount}元,最少收益${this.profitAmount}元`

    // 使用红包金额提示语
    this.valueTip = `使用红包${this.redPacketAmount}元`
  }

  increase = (redPacketId, count = 1) => {
    let redPacketItem = this.redPacketList.filter((item) => item.id === redPacketId)[0]
    if (count > this.maxRuleRedPacketNum) {
      this.showTip(`最多只能选择${this.maxRedPacketNum}个红包哦~`)

      return
    }

    if (redPacketItem.left_num >= count) {
      redPacketItem.valueMap[this.id].redpacket_num += count
      redPacketItem.left_num -= count

      this.profitAmount = 0
      this.maxRuleRedPacketNum -= count
      this.totalRedPacketNum += count
      this.redPacketAmount += Math.floor(count * redPacketItem.value)
      this.settingAmount += Math.floor(count * redPacketItem.user_constraint)

      this.redPacketList.filter((item) => {
        return !!item.valueMap[this.id].redpacket_num
      }).forEach((item) => {
        let redpacketNum = item.valueMap[this.id].redpacket_num
        let userConstraint = item.user_constraint

        this.profitAmount += redpacketNum * userConstraint
      })

      this.profitAmount = profitCalculator(this.profitAmount, this.rate, this.id)

      this.updateTips()
      this.render(this)
    }
  }

  reduce = (redPacketId, count = 1) => {
    let redPacketItem = this.redPacketList.filter((item) => item.id === redPacketId)[0]

    if (redPacketItem.valueMap[this.id].redpacket_num >= count) {
      redPacketItem.valueMap[this.id].redpacket_num -= count
      redPacketItem.left_num += count

      this.profitAmount = 0
      this.maxRuleRedPacketNum += count
      this.totalRedPacketNum -= count
      this.redPacketAmount -= Math.floor(count * redPacketItem.value)
      this.settingAmount -= Math.floor(count * redPacketItem.user_constraint)

      this.redPacketList.filter((item) => {
        return !!item.valueMap[this.id].redpacket_num
      }).forEach((item) => {
        let redpacketNum = item.valueMap[this.id].redpacket_num
        let userConstraint = item.user_constraint

        this.profitAmount += redpacketNum * userConstraint
      })

      this.profitAmount = profitCalculator(this.profitAmount, this.rate, this.id)

      this.updateTips()
      this.render(this)
    }
  }

  input = (redPacketId, value) => {

    let redPacketItem = this.redPacketList.filter((item) => item.id === redPacketId)[0]
    let diff = value - redPacketItem.valueMap[this.id].redpacket_num

    if (diff > 0) {
      this.increase(redPacketId, diff)
    } else {
      this.reduce(redPacketId, Math.abs(diff))
    }

    this.updateTips()
    this.render(this)
  }

  selectAll = (redPacketId) => {
    let redPacketItem = this.redPacketList.filter((item) => item.id === redPacketId)[0]

    if (this.totalRedPacketNum + redPacketItem.left_num > this.maxRuleRedPacketNum) {
      this.showTip(`最多只能选择${this.maxRedPacketNum}个红包哦~`)

      return
    }

    if (redPacketItem.left_num > 0) {
      redPacketItem.valueMap[this.id].redpacket_num += parseFloat(redPacketItem.left_num)

      this.maxRuleRedPacketNum -= parseFloat(redPacketItem.left_num)
      this.totalRedPacketNum += parseFloat(redPacketItem.left_num)
      this.redPacketAmount += Math.floor(redPacketItem.left_num * redPacketItem.value)
      this.settingAmount += Math.floor(redPacketItem.left_num * redPacketItem.user_constraint)
      this.profitAmount += profitCalculator(redPacketItem.left_num * redPacketItem.user_constraint, this.rate, this.id)

      redPacketItem.left_num = 0

      this.updateTips()
      this.render(this)
    }
  }

  updateTips () {
    this.valueTip = `使用红包${this.redPacketAmount}元`

    this.profitTip = `设置${this.settingAmount}元,最少收益${toThousands(this.profitAmount, true)}元`
  }

  setMaxNum (value) {
    this.maxRuleRedPacketNum = value
  }

  genPayload = () => {
    let result = Object.create(null)
    result[this.id] = this.redPacketList
      .filter((item) => {
        return !!item.valueMap[this.id].redpacket_num
      })
      .map((item) => {
        return {
          value: item.value,
          end_time: item.end_time,
          user_constraint: item.user_constraint,
          redpacket_num: item.valueMap[this.id].redpacket_num
        }
      })

    return result
  }
}
