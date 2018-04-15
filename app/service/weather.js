const Service = require('egg').Service
const moment = require('moment')
const WEATHER_SERVER = 'http://api.xanke.net/weather-service'
const superAgent = require('superAgent')

const WEA_RANK = {
  晴: 10,
  多云: 8,
  局部多云: 8,
  零散阵雨: 6,
  阴: 7,
  刮风: 7,
  雪: 6,
  雨: 6,
  阵雨: 6,
  小雨: 6,
  中雨: 4,
  大雨: 2
}

const SUPER_MIN = 17
const SUPER_MAX = 24

class WeatherService extends Service {
  async getDateRangesRank(st, et) {
    let data = await superAgent
      .get(`https://api.xanke.net/weather-service/weather/search?city=shanghai`)
      .query({ st, et })

    let list = data.body

    list.map(item => {
      item.date = moment(item.utime, 'X').format('YYYY-MM-DD')

      const wea = item.wea.split('~')
      const { min, max } = item
      item.rank = this._mathRank(wea, min, max)
    })

    return list
  }

  async getForecast() {
    let data = await superAgent.get(
      `https://api.xanke.net/weather-service-v2/forecast/shanghai`
    )

    let list = data.body

    list.map(item => {
      const wea = item.wea.split('-')
      const { min, max } = item
      item.rank = this._mathRank(wea, min, max)
    })
    return list
  }

  _mathRank(wea, min, max) {
    min = parseInt(min)
    max = parseInt(max)

    const teAvg = (min + max) / 2

    let teRank = 10

    if (teAvg < SUPER_MIN) {
      teRank = teRank - (SUPER_MIN - teAvg)
    }

    if (teAvg > SUPER_MAX) {
      teRank = teRank - (SUPER_MAX - teAvg)
    }

    let weaSum = 0
    wea.forEach(_ => {
      weaSum += WEA_RANK[_]
    })

    const weaRank = weaSum / wea.length

    return [weaRank, teRank]
  }
}

module.exports = WeatherService
