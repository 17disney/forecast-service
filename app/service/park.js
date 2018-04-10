const Service = require('egg').Service
const moment = require('moment')
// const { removeProperty } = require('../util/util')

class ParkService extends Service {
  async updateByLocalDate(find, data) {
    // removeProperty(data)
    let ret = await this.ctx.model.FtPark.update(
      find,
      {
        $set: data
      },
      {
        upsert: true
      }
    )
    return ret
  }
}

module.exports = ParkService
