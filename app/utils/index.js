const moment = require('moment')

function dateRange(st, et, value) {
  let list = {}
  for (
    let i = 0;
    i <= moment(et, 'YYYY-MM-DD').diff(moment(st, 'YYYY-MM-DD'), 'days');
    i++
  ) {
    list[
      moment(st, 'YYYY-MM-DD')
        .add(i, 'days')
        .format('YYYY-MM-DD')
    ] = value
  }
  return list
}

module.exports = {
  dateRange
}
