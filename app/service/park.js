const Service = require('egg').Service
const moment = require('moment')
const Waittimes = require('../common/api/waittimes')
// const { removeProperty } = require('../util/util')

class ParkService extends Service {
  async getDateRange(local, st, et) {
    const data = await Waittimes.park(local, { st, et })
    return data
  }

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
