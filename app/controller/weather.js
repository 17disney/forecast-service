const Controller = require('egg').Controller

class WeatherController extends Controller {
  async history() {
    const { ctx } = this

    const { st, et } = ctx.query
    ctx.body = await ctx.service.weather.getDateRangesRank(st, et)
  }

  async forecast() {
    const { ctx } = this
    ctx.body = await ctx.service.weather.getForecast()
  }
}

module.exports = WeatherController
