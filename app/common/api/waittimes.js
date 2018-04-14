const request = require('../../utils/request')
const SERVER = 'http://127.0.0.1:7001'
// const base = `${SERVER}/wait-times-service`
const base = SERVER

module.exports = {
  ticket: function ticket(local, params) {
    return request({
      url: `${base}/ticket/available/${local}`,
      method: 'get',
      params
    })
  },

  ticketDate: function ticketDate(local, date) {
    return request({
      url: `${base}/ticket/available/${local}/${date}`,
      method: 'get'
    })
  },

  parkDate: function parkDate(local, date) {
    return request({
      url: `${base}/wait-times/park/${local}/${date}`,
      method: 'get'
    })
  },

  park: function park(local, params) {
    return request({
      url: `${base}/wait-times/park/${local}`,
      method: 'get',
      params
    })
  },

  attractionsDate: function attractionsDate(local, id, date) {
    return request({
      url: `${base}/wait-times/attractions/${local}/${id}/${date}`,
      method: 'get'
    })
  },

  attractions: function attractions(local, id, params) {
    return request({
      url: `${base}/wait-times/attractions/${local}/${id}`,
      method: 'get',
      params
    })
  }
}
