const Service = require('egg').Service
const moment = require('moment')
const Waittimes = require('../common/api/waittimes')
const { lineToObject } = require('../utils/api_tool')
// const { removeProperty } = require('../util/util')

class ParkService extends Service {
  async getDateRange(local, st, et) {
    const data = await Waittimes.park(local, { st, et })
    return data
  }

  async updateByLocalDate(find, data) {
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

  async getSchedules(local) {
    const data = await Waittimes.schedulesPre(local)
    let activities = []
    for (const item of data) {
      activities = activities.concat(item.body[0].activities)
    }

    const schedules = {}
    activities.forEach(item => {
      const aid = lineToObject(item.id)['__id__']
      if (item.schedule && item.schedule.schedules) {
        schedules[aid] = item.schedule.schedules
      }
    })
    return schedules
  }
}

module.exports = ParkService
