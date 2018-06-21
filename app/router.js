/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/park', controller.home.index)
  router.put('/park/:local/:date', controller.park.update)

  router.get('/weather/history', controller.weather.history)
  router.get('/weather/forecast', controller.weather.forecast)
  router.get('/day/rank', controller.day.rank)

  router.get('/tickets/:local', controller.ticket.dateRange)
  router.get('/tickets/:local/:date', controller.ticket.date)

  // 预测报告
  router.get('/reports/id/:id', controller.report.id)
  router.get('/reports/park/:local', controller.report.list)
  router.get('/reports/park/:local/latest', controller.report.latest)

  // 乐园预测
  router.get('/forecast/tickets/:local', controller.forecast.ticket)
  router.get('/forecast/park/:local', controller.forecast.park)
  router.get('/forecast/attractions/:local', controller.forecast.attraction)

  // 预测报告 - 旧
  router.get('/forecast/report/:local', controller.forecast.report)

  // 手动更新
  router.get('/update/forecast/:local', controller.forecast.create)
  router.get('/update/tickets/:local/:date', controller.ticket.forecastDate)
}
