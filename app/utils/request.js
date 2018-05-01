const superAgent = require('superagent')

const request = async (options) => {
  const {url, method, params} = options
  let data

  if (params) {
    data  = await superAgent.get(url).query(params)
  } else {
    data  = await superAgent.get(url)
  }

  return data.body
}
module.exports = request
