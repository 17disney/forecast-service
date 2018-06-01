const Service = require('egg').Service
const Waittimes = require('../common/api/waittimes')
const moment = require('moment')
const { dateRangeList, sortByDate } = require('../utils')
const { DATE_FORMAT } = require('../common/const')

const TICKET_AVAILABLE = 20000
const TEAM_MIN = 500
const STORE_ADD = 500

class TicketService extends Service {
  async getDateRange(local, st, et) {
    const { ctx } = this

    const dateSet = new Set(dateRangeList(st, et))

    let find = {
      local,
      date: {
        $gte: st,
        $lte: et
      }
    }

    let data
    data = await ctx.model.FtTicket.find(find, {
      _id: 0,
      local: 0,
      utime: 0
    }).sort({ date: 1 })

    data.forEach(item => {
      dateSet.delete(item.date)
    })

    const newLength = [...dateSet].length

    if (newLength > 0) {
      for (let date of dateSet) {
        const _data = await this.updateDate(local, date)
        await data.push(_data)
      }
      data = sortByDate(data)
    }

    return data
  }

  async getByDate(local, date) {
    const { ctx } = this

    let data
    data = await ctx.model.FtTicket.findOne(
      { local, date },
      {
        _id: 0
      }
    )

    if (!data) {
      data = this.updateDate(local, date)
    }

    return data
  }


  // 更新售票量
  async updateDate(local, date) {
    const { ctx } = this

    const data = await Waittimes.ticketDate(local, date)
    const { availableList } = data

    let teamNum = 0
    let dates = {}
    let dayList = []
    let max = 0

    let ticketNum = 0

    availableList.forEach((item, index) => {
      let [time, available] = item

      if (index === 0) {
        ticketNum = TICKET_AVAILABLE - available
      }

      // 对比上一个数据
      let diff
      if (index > 0) {
        const bItem = availableList[index - 1]
        const [bTime, bAvailable] = bItem
        diff = bAvailable - available
        // 判断大团队
        if (diff > TEAM_MIN) {
          teamNum += diff
        }

        if (diff > 0) {
          ticketNum += diff
        }

        if (diff < 0) {
          // 判断是为补仓
          if (Math.abs(diff) < STORE_ADD) {
            ticketNum += diff
          }
        }
      }

      const date = moment(time, 'x').format(DATE_FORMAT)
      dates[date] = ticketNum
    })

    for (let _date in dates) {
      const dateDiff = moment(_date, DATE_FORMAT).diff(
        moment(date, DATE_FORMAT),
        'days'
      )
      dayList.push([dateDiff, dates[_date]])
    }

    const update = {
      local,
      date,
      ticketNum,
      teamNum,
      dayList,
      utime: Date.now()
    }

    await ctx.model.FtTicket.update(
      { local, date },
      {
        $set: update
      },
      {
        upsert: true
      }
    ).exec()

    return update
  }
}

module.exports = TicketService
