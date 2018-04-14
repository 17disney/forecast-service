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

  router.get('/forecast/tickets/:local', controller.forecast.ticket)
  router.get('/forecast/park/:local', controller.forecast.park)
  // router.get('/forecast/tickets/:date', controller.ticket.forecastDate)

  // router.put('/park/:local/:date', controller.park.update)

  // router.get('/wait-forecast/attractions/:local/:id', controller.forecast.attractionsId)
  // router.put('/wait-forecast/attractions/:local/:id', controller.waitForecast.attractionsId)
  // router.get('/wait-forecast/attractions/:local/:id', controller.waitCount.attractionsId)
}
