const Service = require('egg').Service
const Ticket = require('../common/api/ticket')
const moment = require('moment')
const { dateRangeList, sortByDate } = require('../utils')
const { DATE_FORMAT } = require('../common/const')

const TICKET_ABAILABLE = 20000
const TEAM_MIN = 500

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

  async updateDate(local, date) {
    const { ctx } = this
    const data = await Ticket.availableDate(local, date)

    const { availableList } = data

    let teamNum = 0
    let dates = {}
    let dayList = []

    availableList.forEach((item, index) => {
      const [time, available] = item
      const ticketNum = TICKET_ABAILABLE - available

      const date = moment(time, 'x').format(DATE_FORMAT)
      dates[date] = ticketNum

      // 判断大团队
      if (index > 0) {
        const bItem = availableList[index - 1]
        const [bTime, bAvailable] = bItem
        const bTicketNum = TICKET_ABAILABLE - bAvailable

        const diff = ticketNum - bTicketNum
        if (Math.abs(diff) > TEAM_MIN) {
          teamNum += diff
        }
      }
    })

    for (let _date in dates) {
      const dateDiff = moment(_date, DATE_FORMAT).diff(
        moment(date, DATE_FORMAT),
        'days'
      )
      dayList.push([dateDiff, dates[_date]])
    }

    const ticketNum =
      TICKET_ABAILABLE - availableList[availableList.length - 1][1]

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
