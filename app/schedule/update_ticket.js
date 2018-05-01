const Subscription = require('egg').Subscription
const moment = require('moment')

const { DATE_FORMAT } = require('../common/const')
const MAX_DAYS = 7

class UpdateTicket extends Subscription {
  static get schedule() {
    return {
      interval: '60m',
      type: 'all'
    }
  }

  async subscribe() {
    const { ctx } = this

    for (let i = 0; i <= MAX_DAYS; i++) {
      const date = moment()
        .add(i, 'days')
        .format(DATE_FORMAT)
      ctx.service.ticket.updateDate('shanghai', date)
    }

    console.log('TICKET UPDATED')
  }
}

module.exports = UpdateTicket
