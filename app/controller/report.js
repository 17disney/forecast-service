'use strict';

const Controller = require('egg').Controller;

class ReportController extends Controller {

  async list() {
    const { ctx } = this
    const { local = 'shanghai' } = ctx.params
    const { page = 0, limit = 20} = ctx.query
    ctx.body = await ctx.service.report.getByLocalList(local, page, limit)
  }

  async id() {
    const { ctx } = this
    const { id } = ctx.params
    ctx.body = await ctx.service.report.getById(id)
  }

  async latest() {
    const { ctx } = this
    const { local } = ctx.params
    ctx.body = await ctx.service.report.getByLocal(local)
  }
}

module.exports = ReportController;
