const moment = require('moment')

function dateRangeList(st, et) {
  let list = []
  for (
    let i = 0;
    i <= moment(et, 'YYYY-MM-DD').diff(moment(st, 'YYYY-MM-DD'), 'days');
    i++
  ) {
    list.push(
      moment(st, 'YYYY-MM-DD')
        .add(i, 'days')
        .format('YYYY-MM-DD')
    )
  }
  return list
}

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
  dateRangeList,
  dateRange
}
