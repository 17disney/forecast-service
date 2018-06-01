const Subscription = require('egg').Subscription
const moment = require('moment')

const { DATE_FORMAT } = require('../common/const')

class UpdateReport extends Subscription {
  static get schedule() {
    return {
      interval: '60m',
      type: 'all'
    }
  }

  async subscribe() {
    const { ctx } = this
    ctx.service.forecast.createReport('shanghai')
    console.log(Date.now(), 'REPORT UPDATED')
  }
}

module.exports = UpdateReport
