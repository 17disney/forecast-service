const Controller = require('egg').Controller

class ForecastController extends Controller {
  async ticket() {
    const { ctx } = this
    const { local } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.forecast.getTicket(local, st, et)
  }

  async park() {
    const { ctx } = this
    const { local } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.forecast.getPark(local, st, et)
  }
}

module.exports = ForecastController
