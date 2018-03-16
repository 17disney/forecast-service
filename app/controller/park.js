const Controller = require('egg').Controller
const moment = require('moment')
const { localList } = require('../util/park-list')

// 等待时间查询
class ParkController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.today = moment().format('YYYY-MM-DD')

    this.baseRule = {
      date: { type: 'date', required: true },
      local: { type: 'enum', values: localList, required: true }
    }
  }

  async update() {
    const { ctx, service } = this
    let { flowFt, flowMath, markFt, markMath } =  ctx.request.body
    let { local, date } = ctx.params

    ctx.validate(this.baseRule, ctx.params)

    let find = {
      local,
      date
    }
    let update = {
      flowFt,
      flowMath,
      markFt,
      markMath
    }

    await service.park.updateByLocalDate(find, update)
    ctx.body = update
  }

  // async attraction() {
  //   const { ctx, service } = this
  // }
}

module.exports = ParkController
