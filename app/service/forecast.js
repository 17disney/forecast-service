const Service = require('egg').Service
const moment = require('moment')
const _ = require('lodash')
const SLR = require('ml-regression').SLR
// const { removeProperty } = require('../util/util')

class ForecastService extends Service {
  async getTicket(local, st, et) {
    const { ctx } = this

    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    let mathData = []

    ticketData.forEach((item, index) => {
      let { date, dayList, ticketNum, teamNum } = item

      dayList = dayList.slice(-7)
      const weaRank = weaRankData[index]['rank']
      const dayRank = dayRankData[index]['rank']

      const ticketFT = []

      const d1 = dayList.slice(0, 1) // 前6天
      const d2 = dayList.slice(0, 2) // 前5天
      const d3 = dayList.slice(0, 3) // 前4天
      const d4 = dayList.slice(0, 4) // 前3天
      const d5 = dayList.slice(0, 5) // 前2天
      const d6 = dayList.slice(0, 6) // 前1天

      ticketFT.push(this.mathTicket(d1, weaRank, dayRank))
      ticketFT.push(this.mathTicket(d2, weaRank, dayRank))
      ticketFT.push(this.mathTicket(d3, weaRank, dayRank))
      ticketFT.push(this.mathTicket(d4, weaRank, dayRank))
      ticketFT.push(this.mathTicket(d5, weaRank, dayRank))
      ticketFT.push(this.mathTicket(d6, weaRank, dayRank))

      const forecast = []
      ticketFT.forEach(_ => {
        const ticketNumFT = _[6][1]
        const mk = Math.round(100 - Math.abs(ticketNumFT - ticketNum) / ticketNum * 100)
        forecast.push([_, mk])
      })

      mathData.push({
        date,
        ticketNum,
        teamNum,
        dayList,
        weaRank,
        dayRank,
        forecast
      })
    })

    return mathData
  }

  mathTicket(num, weaRank, dayRank) {
    const pos = -(7 - num.length)
    let ticketNum = num[num.length - 1][1]
    weaRank = _.sum(weaRank)
    dayRank = _.sum(dayRank)

    const END_SLOPE = 200
    let slope = 50


    if (pos === -6) {
      for (let i = -5; i <= -2; i++) {
        ticketNum += parseInt(slope * (1 + weaRank * 0.15 + dayRank * 0.15))

        console.log(ticketNum)
        num.push([i, ticketNum])
      }
    } else if (pos >= -5) {
      const inputs = num.map(_ => _[0]).slice(-5)
      const outputs = num.map(_ => _[1]).slice(-5)
      const regression = new SLR(inputs, outputs)
      slope = regression.slope

      for (let i = pos + 1; i <= -2; i++) {
        ticketNum += parseInt(slope * (1 + weaRank * 0.15 + dayRank * 0.15))
        num.push([i, ticketNum])
      }
    }

    if (pos === -1) {
      const inputs = num.map(_ => _[0]).slice(-2)
      const outputs = num.map(_ => _[1]).slice(-2)
      const regression = new SLR(inputs, outputs)
      slope = regression.slope

      ticketNum += parseInt(slope * (1 + weaRank * 0.15 + dayRank * 0.15))
      num.push([-1, ticketNum])
    } else {
      ticketNum += parseInt(slope * (1 + 0.2 + weaRank * 0.15 + dayRank * 0.15))
      num.push([-1, ticketNum])
    }

    ticketNum += parseInt(
      (END_SLOPE + slope) * (1 + weaRank * 0.15 + dayRank * 0.15)
    )
    num.push([0, ticketNum])
    // 计算最后一天

    return num
  }
}

module.exports = ForecastService
