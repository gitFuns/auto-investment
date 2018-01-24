/* eslint-disable */
const profitCalculator = (value, rate, duration) => {
  let result = 0
  let innerRate = rate / (12 * 100)
  let li = Math.pow((1 + innerRate), duration)
  let repayment = value * (innerRate * li) / (li - 1)

  repayment = Math.floor(repayment * 100) / 100
  for (let i = 0; i < duration; i++) {
    let interest
    if (i == 0) {
      interest = Math.floor(value * innerRate * 100)
    } else {
      interest = (value * innerRate - repayment) * Math.pow((1 + innerRate), i) + repayment
      interest = Math.floor(interest * 100)
    }

    result += interest
  }

  return result / 100
}

export default profitCalculator
