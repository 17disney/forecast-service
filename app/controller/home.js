const Controller = require('egg').Controller

const pkg = require('../../package.json')

class HomeController extends Controller {
  async index() {
    let { name, version } = pkg
    this.ctx.body = { name, version }
  }
}

module.exports = HomeController
