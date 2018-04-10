const {
  DAYS,
  FIXED,
  HANJIA,
  SHUJIA,
  JIKA
} = require('../common/data/festival_days')

const moment = require('moment')
const Service = require('egg').Service

class DaysService extends Service {
  async getDateRank(date) {
    const da = moment(date, 'YYYY-MM-DD').format('MM-DD')

    let rank = []

    // 提取节日
    if (DAYS[date]) {
      rank.push(['jieri', DAYS[date]])
    }

    // 提取固定节日
    if (FIXED[da]) {
      rank.push(['jieri', FIXED[da]])
    }

    if (HANJIA[date]) {
      rank.push(['hanjia', HANJIA[date]])
    }

    if (SHUJIA[date]) {
      rank.push(['shujia', SHUJIA[date]])
    }

    if (JIKA[date]) {
      rank.push(['jika', JIKA[date]])
    }

    return rank
  }
}

module.exports = DaysService
