const Service = require('egg').Service
const moment = require('moment')
// const { removeProperty } = require('../util/util')

class ForecastService extends Service {
  async getTicket(local, st, et) {
    const { ctx } = this

    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    let mathData = []

    ticketData.forEach((item, index) => {
      let { date, dayList } = item

      dayList = dayList.slice(-7)
      const weaRank = weaRankData[index]['rank']
      const dayRank = dayRankData[index]

      mathData.push({
        date,
        dayList,
        weaRank,
        dayRank
      })
    })

    return mathData
  }
}

module.exports = ForecastService
