// 天气服务
const config = require('config-lite')(__dirname)
const superAgent = require('superagent')
const moment = require('moment')

let ApiUrl = config.weatherService.url

module.exports = {
  day: async (city, date) => {
    let query = {
      city,
      date
    }
    let url = `${ApiUrl}/weather/day`
    let data = await superAgent.get(url).query(query)
    return data.body
  },
  search: async (city, st, et) => {
    let query = {
      city,
      st,
      et
    }
    let url = `${ApiUrl}/weather/search`
    let data = await superAgent.get(url).query(query)
    return data.body
  }
}
