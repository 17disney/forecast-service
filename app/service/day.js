const {
  DAYS,
  FIXED,
  HANJIA,
  SHUJIA,
  JIKA
} = require('../common/data/festival_days')

const { dateRangeList } = require('../utils')
const moment = require('moment')
const Service = require('egg').Service

class DaysService extends Service {
  async getDateRangeRank(st, et) {
    const list = dateRangeList(st, et)
    const dates = []
    list.forEach(date => {
      dates.push({
        date,
        rank: this.getDateRank(date)
      })
    })
    return dates
  }

  getDateRank(date) {
    const da = moment(date, 'YYYY-MM-DD').format('MM-DD')

    let rank = []

    const WEEK_RANK = [2, 3, 3, 3, 4, 5, 5]
    const week = moment(date, 'YYYY-MM-DD').format('d')

    rank.push(WEEK_RANK[week])

    // 提取节日
    if (DAYS[date]) {
      // rank.push(['jieri', DAYS[date]])
      rank.push(DAYS[date])
    }

    // 提取固定节日
    if (FIXED[da]) {
      // rank.push(['jieri', FIXED[da]])
      rank.push(FIXED[da])
    }

    if (HANJIA[date]) {
      // rank.push(['hanjia', HANJIA[date]])
      rank.push(HANJIA[date])
    }

    if (SHUJIA[date]) {
      // rank.push(['shujia', SHUJIA[date]])
      rank.push(SHUJIA[date])
    }

    if (JIKA[date]) {
      // rank.push(['jika', JIKA[date]])
      rank.push(JIKA[date])
    }

    return rank
  }
}

module.exports = DaysService
