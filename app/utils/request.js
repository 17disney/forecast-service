const superAgent = require('superAgent')

const request = async (options) => {
  const {url, method, params} = options
  let data

  console.log(url)

  if (params) {
    data  = await superAgent.get(url).query(params)
  } else {
    data  = await superAgent.get(url)
  }

  return data.body
}
module.exports = request
