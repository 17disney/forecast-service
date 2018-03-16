// 乐园通用信息表
const parkList = [
  {
    id: '80007798',
    lang: 'US',
    local: 'orlando',
    utc: -5
  },
  {
    id: '80008297',
    lang: 'US',
    utc: -8,
    local: 'california'
  },
  {
    id: 'dlp',
    lang: 'GB',
    local: 'paris',
    utc: -1
  },
  {
    id: 'hkdl',
    lang: 'CN',
    local: 'hongkong',
    utc: 8
  },
  {
    id: 'shdr',
    lang: 'CN',
    local: 'shanghai',
    utc: 8,
    disneyLand: 'desShanghaiDisneyland'
  }
]

exports.localList = localList = parkList.map(_=>{return _.local})
exports.parkList = parkList
