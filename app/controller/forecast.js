const Controller = require('egg').Controller

class ForecastController extends Controller {
  async ticket() {
    const { ctx } = this
    const { local } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.forecast.getTicket(local, st, et)
  }

  async report() {
    const { ctx } = this
    const { local } = ctx.params
    ctx.body = await ctx.service.forecast.getReport(local)
  }

  async park() {
    const { ctx } = this
    const { local } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.forecast.getPark(local, st, et)
  }

  async attraction() {
    const { ctx } = this
    const { local, id } = ctx.params
    const { st, et } = ctx.query
    ctx.body = await ctx.service.forecast.getAttraction(local, st, et)
  }
}

module.exports = ForecastController
