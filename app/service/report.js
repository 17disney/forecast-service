const Service = require('egg').Service
const moment = require('moment')

class ReportService extends Service {
  async getByLocal(local) {
    const { ctx } = this
    const data = await ctx.model.FtReport.findOne(
      {
        local
      },
      {
        _id: 0
      }
    ).sort({
      utime: -1
    })
    return data
  }
}

module.exports = ReportService
