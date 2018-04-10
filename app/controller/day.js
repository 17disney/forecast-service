const Controller = require('egg').Controller

class DayController extends Controller {
  async rank() {
    const { ctx } = this
    const { st, et } = ctx.query
    ctx.body = await ctx.service.day.getDateRangeRank(st ,et)
  }
}

module.exports = DayController
