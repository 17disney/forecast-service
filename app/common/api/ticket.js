const request = require('../../utils/request')
const SERVER = 'http://127.0.0.1:7001'
// const base = `${SERVER}/wait-times-service`
const base = SERVER

module.exports =  {
  available: function available(local, params) {
    return request({
      url: `${base}/ticket/available/${local}`,
      method: 'get',
      params
    })
  },

  availableDate: function availableDate(local, date) {
    return request({
      url: `${base}/ticket/available/${local}/${date}`,
      method: 'get'
    })
  }
}
