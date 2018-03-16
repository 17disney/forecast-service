/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  router.get('/park', controller.home.index)
  router.put('/park/:local/:date', controller.park.update)

  // router.put('/park/:local/:date', controller.park.update)

  // router.get('/wait-forecast/attractions/:local/:id', controller.forecast.attractionsId)
  // router.put('/wait-forecast/attractions/:local/:id', controller.waitForecast.attractionsId)
  // router.get('/wait-forecast/attractions/:local/:id', controller.waitCount.attractionsId)

}
