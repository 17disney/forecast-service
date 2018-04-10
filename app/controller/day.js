const Controller = require('egg').Controller

class DayController extends Controller {
  async date() {
    const { ctx } = this
    const { date } = ctx.params
    ctx.body = await ctx.service.day.getDateRank(date)
  }
}

module.exports = DayController
