const Service = require('egg').Service
const moment = require('moment')

class ReportService extends Service {
  // 获取最新报告
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

  async getById(_id) {
    const { ctx } = this
    const data = await ctx.model.FtReport.findOne(
      {
        _id
      },
      {
        _id: 0
      }
    )
    return data
  }

  // 获取报告列表
  async getByLocalList(local, page, limit) {
    const { ctx } = this
    const data = await ctx.model.FtReport.find(
      {
        local
      },
      {
        // _id: 0,
        data: 0
      }
    ).sort({
      utime: -1
    }).limit(limit).skip(page * limit)
    return data
  }

}

module.exports = ReportService
