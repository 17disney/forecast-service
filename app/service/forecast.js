const Service = require('egg').Service
const moment = require('moment')
const _ = require('lodash')
const SLR = require('ml-regression').SLR
// const { removeProperty } = require('../util/util')

class ForecastService extends Service {
  async getTicket(local, st, et) {
    const { ctx } = this
    const FT_DAYS = 7

    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    let mathData = []

    ticketData.forEach((item, index) => {
      let { date, dayList, ticketNum, teamNum } = item

      dayList = dayList.slice(-FT_DAYS)
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
      ticketFT.forEach(list => {
        const ticketNumFT = list[FT_DAYS - 1][1]
        const rate = Math.round(
          100 - Math.abs(ticketNumFT - ticketNum) / ticketNum * 100
        )

        forecast.push({
          list,
          rate,
          ticketNumFT
        })
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

  ticketFTList(list, ticketNum) {
    const pos = -(FT_DAYS - list.length)

    if (ticketNum > 20000) {
      ticketNum = 20000
    }

    ticketNum = parseInt(ticketNum)
    list.push([pos + 1, ticketNum])
    return list
  }

  mathTicket(num, weaRank, dayRank) {
    const pos = -(FT_DAYS - num.length)
    let ticketNum = num[num.length - 1][1]
    weaRank = _.sum(weaRank)
    dayRank = _.sum(dayRank)

    const END_SLOPE = 200
    let slope = 50

    if (pos === -(FT_DAYS - 1)) {
      for (let i = -5; i <= -2; i++) {
        ticketNum += slope * (1 + weaRank * 0.15 + dayRank * 0.15)
        num = this.ticketFTList(num, ticketNum)
      }
    } else if (pos >= -5) {
      const inputs = num.map(_ => _[0]).slice(-5)
      const outputs = num.map(_ => _[1]).slice(-5)
      const regression = new SLR(inputs, outputs)
      slope = regression.slope

      for (let i = pos + 1; i <= -2; i++) {
        ticketNum += slope * (1 + weaRank * 0.1 + dayRank * 0.1)
        num = this.ticketFTList(num, ticketNum)
      }
    }

    if (pos === -1) {
      const inputs = num.map(_ => _[0]).slice(-2)
      const outputs = num.map(_ => _[1]).slice(-2)
      const regression = new SLR(inputs, outputs)
      slope = regression.slope * 0.7 - 100

      // ticketNum += slope * (1 + weaRank * 0.15 + dayRank * 0.15)
      // num = this.ticketFTList(num, ticketNum)
    } else {
      ticketNum += slope * (1 + 0.2 + weaRank * 0.15 + dayRank * 0.15)
      num = this.ticketFTList(num, ticketNum)
    }

    ticketNum += (END_SLOPE + slope) * (1 + weaRank * 0.05 + dayRank * 0.1)

    num = this.ticketFTList(num, ticketNum)
    // 计算最后一天

    return num
  }

  async getPark(local, st, et) {
    const { ctx } = this
    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let parkData = await ctx.service.park.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    const TICKET_RANK = 6
    const FLOW_STAGE2 = 10000

    parkData.forEach((item, index) => {
      let { ticketNum, ticketTeam } = ticketData[index]

      const { flowMax } = item
      const STAGE1 = 5000
      const STAGE2 = 8000


      let flowMaxFT = 18000
      if (ticketNum < STAGE1) {
        flowMaxFT += ticketNum *TICKET_RANK
      }
      if (ticketNum > STAGE1){
        const stage = (ticketNum - STAGE1) > STAGE1 ? STAGE1 : ticketNum - STAGE1
        console.log(stage)
        flowMaxFT += stage * TICKET_RANK / 0.7
      }

      if (ticketNum > STAGE2) {
        flowMaxFT += (ticketNum - STAGE2) * TICKET_RANK * 0.1
      }

      const rate = Math.round(
        100 - Math.abs(flowMaxFT - flowMax) / flowMax * 100
      )

      item.ticketNum = ticketNum
      item.flowMaxFTRate = rate
      item.flowMaxFT = parseInt(flowMaxFT)
    })

    return parkData
  }
}

module.exports = ForecastService
