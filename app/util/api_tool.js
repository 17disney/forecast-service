const moment = require('moment')

const objectToLine = arg => {
  let line = []

  for (let k in arg) {
    let item = arg[k]
    if (k === '__id__') {
      line.push(item)
    } else {
      line.push(`${k}=${item}`)
    }
  }

  line = line.join(';')
  return line
}

const lineToObject = arg => {
  let obj = {}
  let arr = arg.split(';')

  for (let item of arr) {
    item = item.split('=')
    if (item.length == 1) {
      obj['__id__'] = item[0]
    } else {
      obj[item[0]] = item[1]
    }
  }
  return obj
}

const createUrl = data => {
  let url = data.host + data.path + '/'
  if (data.arg) {
    url += objectToLine(data.arg)
  }
  return url
}

const utcDate = utc => {
  let date = moment()
    .utcOffset(utc)
    .format('YYYY-MM-DD')
  return date
}

exports.createUrl = createUrl
exports.objectToLine = objectToLine
exports.lineToObject = lineToObject
exports.utcDate = utcDate
