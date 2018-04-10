const Controller = require('egg').Controller

class WeatherController extends Controller {
  async index() {
    const { ctx } = this

    const { st, et } = ctx.params
    ctx.body = await ctx.service.weather.mathHistory(st, et)
  }
}

module.exports = WeatherController
