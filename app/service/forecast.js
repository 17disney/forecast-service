const Service = require('egg').Service
const moment = require('moment')
const _ = require('lodash')
const SLR = require('ml-regression').SLR
const Waittimes = require('../common/api/waittimes')
const FT_DAYS = 7
const DATE_FORMAT = 'YYYY-MM-DD'

class ForecastService extends Service {
  async getTicket(local, st, et) {
    const { ctx } = this

    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    let mathData = []

    ticketData.forEach((item, index) => {
      let { date, dayList, ticketNum, teamNum } = item

      dayList = dayList.slice(-FT_DAYS)
      const weaRank = weaRankData[index] ? weaRankData[index]['rank'] : [10]
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
    ticketNum = parseInt(ticketNum)
    list.push([pos + 1, ticketNum])
    return list
  }

  // 预测售票量
  mathTicket(num, weaRank, dayRank) {
    if (num.length === 0) {
      return false
    }
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
    } else {
      ticketNum += slope * (1 + 0.2 + weaRank * 0.15 + dayRank * 0.15)
      num = this.ticketFTList(num, ticketNum)
    }

    ticketNum += (END_SLOPE + slope) * (1 + weaRank * 0.05 + dayRank * 0.1)

    num = this.ticketFTList(num, ticketNum)
    // 计算最后一天

    return num
  }

  // 创建预测报告
  async createReport(local) {
    const { ctx } = this

    const st = moment()
      .add(1, 'days')
      .format(DATE_FORMAT)
    const et = moment()
      .add(6, 'days')
      .format(DATE_FORMAT)

    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getForecast()
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)
    const schedulesData = await ctx.service.park.getSchedules(local)

    const weaRanks = {}
    weaRankData.forEach(item => {
      weaRanks[item.date] = item
    })

    let mathData = []

    for (let index in ticketData) {
      let item = ticketData[index]

      let { date, dayList, ticketNum, teamNum } = item

      const weaRank = weaRankData[index] ? weaRankData[index]['rank'] : [10]
      const dayRank = dayRankData[index]['rank']

      let dList = []
      dayList.forEach(arr => {
        const [day, num] = arr
        if (day >= -7) {
          dList.push(arr)
        }
      })

      // 去除当天售票量
      dList = dList.slice(0, dList.length - 1)

      const ticketFT = []

      const dayListFT = this.mathTicket(dList, weaRank, dayRank)

      if (!dayListFT) {
        break
      }

      const ticketNumFT = dList[FT_DAYS - 1][1]
      const flowMaxFT = this.mathFlow(ticketNumFT)
      const attractions = await this.mathAttractions(
        flowMaxFT,
        schedulesData,
        date
      )

      mathData.push({
        date,
        attractions,
        ticketNum,
        teamNum,
        dayList: dList,
        dayListFT,
        ticketNumFT,
        flowMaxFT,
        weaRank,
        dayRank
      })
    }

    ctx.model.FtReport.create({
      date: moment().format(DATE_FORMAT),
      local,
      utime: Date.now(),
      data: mathData
    })

    return mathData
  }

  // 计算项目等候时间
  async mathAttractions(flow, schedulesData, date) {
    const { ctx } = this
    const attList = await ctx.model.FtAttraction.find()

    const list = []
    attList.forEach(item => {
      const { mathAvg, mathMax, id } = item
      const [a1, a2] = mathAvg
      const [m1, m2] = mathMax

      const waitAvg = a1 * flow + a1 > 0 ? parseInt(a1 * flow + a1) : 0
      const waitMax = m1 * flow + m2 > 0 ? parseInt(m1 * flow + m2) : 0

      const arr = {
        id,
        waitAvg,
        waitMax
      }

      // 合并开放时间
      let schedule = schedulesData[id]
      if (schedule && arr) {
        schedule = schedule.find(_ => _.date === date)
        Object.assign(arr, schedule)
      }

      list.push(arr)
    })

    // 临时借用
    list.forEach(item => {
      // 抱抱龙冲天赛车 <- 喷气背包飞行器
      if (item.id === 'attRexsRCRacer') {
        item.waitAvg = list.find(_ => _.id === 'attJetPacks')['waitAvg']
        item.waitMax = list.find(_ => _.id === 'attJetPacks')['waitMax']
      }

      // 胡迪牛仔嘉年华 <- 旋转木马
      if (item.id === 'attWoodysRoundUp') {
        item.waitAvg = list.find(_ => _.id === 'attFantasiaCarousel')['waitAvg']
        item.waitMax = list.find(_ => _.id === 'attFantasiaCarousel')['waitMax']
      }

      // 弹簧狗团团转 <- 旋转木马
      if (item.id === 'attSlinkyDogSpin') {
        item.waitAvg = list.find(_ => _.id === 'attFantasiaCarousel')['waitAvg']
        item.waitMax = list.find(_ => _.id === 'attFantasiaCarousel')['waitMax']
      }
    })

    return list
  }

  async getPark(local, st, et) {
    const { ctx } = this
    let ticketData = await ctx.service.ticket.getDateRange(local, st, et)

    let parkData = await ctx.service.park.getDateRange(local, st, et)
    let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let dayRankData = await ctx.service.day.getDateRangeRank(st, et)

    parkData.forEach((item, index) => {
      let { ticketNum, ticketTeam } = ticketData[index]

      const { flowMax } = item

      const flowMaxFT = this.mathFlow(ticketNum)
      const rate = Math.round(
        100 - Math.abs(flowMaxFT - flowMax) / flowMax * 100
      )

      item.ticketNum = ticketNum
      item.flowMaxFTRate = rate
      item.flowMaxFT = parseInt(flowMaxFT)
    })

    return parkData
  }

  // 计算客流量
  mathFlow(ticketNum) {
    const TICKET_RANK = 6
    const STAGE1 = 5000
    const STAGE2 = 8000

    let flowMaxFT = 18000
    if (ticketNum < STAGE1) {
      flowMaxFT += ticketNum * TICKET_RANK
    }
    if (ticketNum > STAGE1) {
      const stage = ticketNum - STAGE1 > STAGE1 ? STAGE1 : ticketNum - STAGE1
      flowMaxFT += stage * TICKET_RANK / 0.7
    }

    if (ticketNum > STAGE2) {
      flowMaxFT += (ticketNum - STAGE2) * TICKET_RANK * 0.1
    }

    return parseInt(flowMaxFT)
  }

  // 更新项目算法
  async updateAttractionMath(local, id, st, et, parkData) {
    const { ctx } = this
    let attData = await Waittimes.attractions(local, id, { st, et })

    const x = []
    const maxList = []
    const avgList = []

    // parkData.forEach(item => {
    //   x.push(item['flowMax'])
    // })

    attData.forEach((item, index) => {
      if (item.date !== '2018-04-26') {
        if (item['waitMax'] > 0) {
          maxList.push(item['waitMax'])
          avgList.push(item['waitAvg'])

          x.push(parkData[index]['flowMax'] * 1.2)
        }
      }
    })

    const { slope: maxSlope, intercept: maxIntercept } = new SLR(x, maxList)
    const { slope: avgSlope, intercept: avgIntercept } = new SLR(x, avgList)

    const $set = {
      local,
      id,
      mathMax: [maxSlope, maxIntercept],
      mathAvg: [avgSlope, avgIntercept]
    }

    ctx.model.FtAttraction.update(
      {
        local,
        id
      },
      { $set },
      {
        upsert: true
      }
    ).exec()
  }

  async getAttraction(local, st, et) {
    const { ctx } = this
    // let weaRankData = await ctx.service.weather.getDateRangesRank(st, et)
    let parkData = await ctx.service.park.getDateRange(local, st, et)
    let attList = await Waittimes.home(local, '2018-04-27')

    attList.forEach(item => {
      const id = item.id
      this.updateAttractionMath(local, id, st, et, parkData)
    })
    return 'ok'
  }
}

module.exports = ForecastService
