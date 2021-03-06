const { dateRange } = require('../../utils')

const TYPE = {
  WUYI: 8,
  DUANWU: 8,
  ERTONG: 8,
  GUOQING: 12,
  SHENGDAN: 10,
  YUANDAN: 8,
  CHUXI: -4,
  GUONIAN: 12,
  ZHONGQIU: 10,
  MENGXIANG: 10,
  HANJIA: 10,
  SHUJIA: 10,
  JIKA: 5,
  SANBA: 8,
  QINGMING: 10
}

const DAYS = {
  '2017-04-29': TYPE.WUYI,
  '2017-04-30': TYPE.WUYI,
  '2017-05-01': TYPE.WUYI,
  '2017-05-28': TYPE.DUANWU,
  '2017-05-29': TYPE.DUANWU,
  '2017-05-30': TYPE.DUANWU,
  '2017-06-01': TYPE.ERTONG,
  '2017-09-30': TYPE.GUOQING,
  '2017-10-01': TYPE.GUOQING,
  '2017-10-02': TYPE.GUOQING,
  '2017-10-03': TYPE.GUOQING,
  '2017-10-04': TYPE.GUOQING,
  '2017-10-05': TYPE.GUOQING,
  '2017-10-06': TYPE.GUOQING,
  '2017-10-07': TYPE.GUOQING,
  '2017-10-08': TYPE.GUOQING,
  '2017-12-24': TYPE.SHENGDAN,
  '2017-12-25': TYPE.SHENGDAN,
  '2017-12-30': TYPE.YUANDAN,
  '2018-01-01': TYPE.YUANDAN,
  '2018-02-15': TYPE.CHUXI,
  '2018-02-16': TYPE.YUANDAN,
  '2018-02-17': TYPE.YUANDAN,
  '2018-02-18': TYPE.YUANDAN,
  '2018-02-19': TYPE.YUANDAN,
  '2018-02-20': TYPE.YUANDAN,
  '2018-02-21': TYPE.YUANDAN,
  '2018-04-05': TYPE.QINGMING,
  '2018-04-06': TYPE.QINGMING,
  '2018-04-07': TYPE.QINGMING,
  '2018-04-29': TYPE.WUYI,
  '2018-04-30': TYPE.WUYI,
  '2018-05-01': TYPE.WUYI,
  '2018-06-01': TYPE.ERTONG,
  '2018-06-16': TYPE.DUANWU,
  '2018-06-17': TYPE.DUANWU,
  '2018-06-18': TYPE.DUANWU,
  '2018-09-22': TYPE.ZHONGQIU,
  '2018-09-23': TYPE.ZHONGQIU,
  '2018-09-24': TYPE.ZHONGQIU,
  '2018-10-01': TYPE.GUOQING,
  '2018-10-02': TYPE.GUOQING,
  '2018-10-03': TYPE.GUOQING,
  '2018-10-04': TYPE.GUOQING,
  '2018-10-05': TYPE.GUOQING,
  '2018-10-06': TYPE.GUOQING,
  '2018-10-07': TYPE.GUOQING
}

let HANJIA_RANGE = {
  2018: ['2018-01-26', '2018-02-22']
}

const SHUJIA_RANGE = ['07-01', '08-31']

const FIXED = {
  '03-08': TYPE.SANBA,
  '06-16': TYPE.MENGXIANG,
  '01-01': TYPE.YUANDAN,
  '12-24': TYPE.SHENGDAN,
  '12-24': TYPE.SHENGDAN
}

const JIKA_RANGE = {
  '2016A': ['2016-11-12', '2017-03-31'],
  '2017A': ['2017-03-18', '2017-07-18'],
  '2017B': ['2017-09-03', '2018-01-25'],
  '2018A': ['2018-03-16', '2018-07-31']
}

const SHUJIA = dateRange(SHUJIA_RANGE[0], SHUJIA_RANGE[1], TYPE.SHUJIA)
const HANJIA = (function() {
  let list = {}
  for (let k in HANJIA_RANGE) {
    const item = HANJIA_RANGE[k]
    const [st, et] = item
    Object.assign(list, dateRange(st, et, TYPE.HANJIA))
  }
  return list
})()

const JIKA = (function() {
  let list = {}
  for (let k in JIKA_RANGE) {
    const [st, et] = JIKA_RANGE[k]
    Object.assign(list, dateRange(st, et, TYPE.JIKA))
  }
  return list
})()

module.exports = {
  DAYS,
  FIXED,
  HANJIA,
  SHUJIA,
  JIKA
}
