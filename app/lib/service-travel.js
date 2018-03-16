// 天气服务
const config = require('config-lite')(__dirname)
const superAgent = require('superagent')
const moment = require('moment')

let ApiUrl = config.travelService.url

module.exports = {
  flowDay: async (cid, date) => {
    let query = {
      cid,
      date
    }
    let url = `${ApiUrl}/flow/day`
    let data = await superAgent.get(url).query(query)
    return data.body
  }
}
