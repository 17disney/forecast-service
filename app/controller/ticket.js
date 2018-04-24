const Controller = require('egg').Controller

class TicketController extends Controller {
  async date() {
    const { ctx } = this
    const { local, date } = ctx.params
    ctx.body = await ctx.service.ticket.getByDate(local, date)
  }

  async dateRange() {
    const { ctx } = this
    const { local } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.ticket.getDateRange(local, st, et)
  }
}

module.exports = TicketController
