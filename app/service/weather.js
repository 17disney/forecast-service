const Service = require('egg').Service
const moment = require('moment')
const WEATHER_SERVER = 'http://api.xanke.net/weather-service'


const WEA_MATH = {

  '晴': 1,



}

class WeatherService extends Service {
  async mathHistory(st, et) {
    let list = await superAgent.get(
      `https://api.xanke.net/weather-service/weather/search?city=shanghai&st=${st}&${et}`
    )

    list.map(item => {
      item.date = moment(item.utime, 'X').format('YYYY-MM-DD')
    })

    return list
  }
}

module.exports = WeatherService
