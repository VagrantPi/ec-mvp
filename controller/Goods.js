const Utils = require('../lib/Utils')
const ResponseFormat = require('../lib/ResponseFormat')

class User {
  constructor({
    config, logger, db,
  }) {
    this.config = config;
    this.logger = logger;
    this.db = db;
  }

  async AddGoods(ctx) {
    try {
      this.logger.debug('AddGoods api')
      const { authorization: token } = ctx.request.header;

      const validToken = Utils.verifyToken({ token, secret: this.config.jwt.secret })
      if (!validToken) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const { goods_name: name } = ctx.request.body;
      if (!name) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidInput' })
        return
      }

      const insertGoods = await this.db.goods.create({ name })
      ctx.body = new ResponseFormat({ codesKey: 'Success', data: {
        _id:insertGoods.id,
        goods_name: insertGoods.name
      }})
      return
    } catch (e) {
      this.logger.debug(`AddGoods api error: ${e.message}`)
      throw e;
    }
  }

  async ListGoods(ctx) {
    try {
      this.logger.debug('ListGoods api')
      const { authorization: token } = ctx.request.header;

      const validToken = Utils.verifyToken({ token, secret: this.config.jwt.secret })
      if (!validToken) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const findGoods = await this.db.goods.findAll({
        attributes: [['id', '_id'], ['name', 'goods_name']]
      })
      ctx.body = new ResponseFormat({ codesKey: 'Success', data: findGoods })
      return
    } catch (e) {
      this.logger.debug(`ListGoods api error: ${e.message}`)
      throw e;
    }
  }

  async FindGoods(ctx) {
    try {
      this.logger.debug('FindGoods api')
      const { authorization: token } = ctx.request.header;

      const validToken = Utils.verifyToken({ token, secret: this.config.jwt.secret })
      if (!validToken) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const { id } = ctx.request.params
      const findGoods = await this.db.goods.findOne({
        where: { id },
        attributes: [['id', '_id'], ['name', 'goods_name']]
      })
      if (!findGoods) {
        ctx.body = new ResponseFormat({ codesKey: 'GoodsNotFound' })
        return
      }

      ctx.body = new ResponseFormat({ codesKey: 'Success', data: findGoods })
      return
    } catch (e) {
      this.logger.debug(`FindGoods api error: ${e.message}`)
      throw e;
    }
  }

  async UpdateGoods(ctx) {
    try {
      this.logger.debug('UpdateGoods api')
      const { authorization: token } = ctx.request.header;

      const validToken = Utils.verifyToken({ token, secret: this.config.jwt.secret })
      if (!validToken) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const { goods_name: name } = ctx.request.body;
      if (!name) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidInput' })
        return
      }

      const { id } = ctx.request.params
      const findGoods = await this.db.goods.findOne({ where: { id } })
      if (!findGoods) {
        ctx.body = new ResponseFormat({ codesKey: 'GoodsNotFound' })
        return
      }

      await this.db.goods.update({ name }, {
        where: { id }
      })
      ctx.body = new ResponseFormat({ codesKey: 'Success', data: {
        _id: id,
        goods_name: name
      } })
      return
    } catch (e) {
      this.logger.debug(`UpdateGoods api error: ${e.message}`)
      throw e;
    }
  }

  async DeleteGoods(ctx) {
    try {
      this.logger.debug('DeleteGoods api')
      const { authorization: token } = ctx.request.header;

      const validToken = Utils.verifyToken({ token, secret: this.config.jwt.secret })
      if (!validToken) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const { id } = ctx.request.params
      const findGoods = await this.db.goods.findOne({ where: { id } })
      if (!findGoods) {
        ctx.body = new ResponseFormat({ codesKey: 'GoodsNotFound' })
        return
      }

      await this.db.goods.destroy({
        where: { id }
      })
      ctx.body = new ResponseFormat({ codesKey: 'Success' })
      return
    } catch (e) {
      this.logger.debug(`DeleteGoods api error: ${e.message}`)
      throw e;
    }
  }
}
module.exports = User;
