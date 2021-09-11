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

  /**
   * @swagger
   * 
   * definitions:
   *   addGoodsResponse:
   *     type: object
   *     properties:
   *       success:
   *         type: string
   *       code:
   *         type: string
   *       message:
   *         type: string
   *       data:
   *         type: object
   *         properties:
   *           _id:
   *             type: string
   *           goods_name:
   *             type: string
   *
   * /goods/add:
   *   post:
   *     tags:
   *       - Goods
   *     produces:
   *       - application/json
   * 
   *     description: 新增商品
   *     parameters:
   *       - name: goods_name
   *         in: formData
   *         required: true
   *         type: string
   *         description: 商品名稱
   *       - name: Authorization
   *         in: header
   *         required: true
   *         type: string
   *         description: Token
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/addGoodsResponse'
   */
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


  /**
   * @swagger
   * 
   * components:
   *   schemas:
   *     goodsItem:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *         goods_name:
   *           type: string
   * 
   * definitions:
   *   listGoodsResponse:
   *     type: object
   *     properties:
   *       success:
   *         type: string
   *       code:
   *         type: string
   *       message:
   *         type: string
   *       data:
   *         type: array
   *         items:
   *           $ref: '#/components/schemas/goodsItem'
   *
   * /goods:
   *   get:
   *     tags:
   *       - Goods
   *     produces:
   *       - application/json
   * 
   *     description: 取得所有商品
   *     parameters:
   *       - name: Authorization
   *         in: header
   *         required: true
   *         type: string
   *         description: Token
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/listGoodsResponse'
   */
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

  /**
   * @swagger
   * 
   * definitions:
   *   findGoodsResponse:
   *     type: object
   *     properties:
   *       success:
   *         type: string
   *       code:
   *         type: string
   *       message:
   *         type: string
   *       data:
   *         type: object
   *         $ref: '#/components/schemas/goodsItem'
   * 
   * /goods/{id}:
   *   get:
   *     tags:
   *       - Goods
   *     produces:
   *       - application/json
   * 
   *     description: 取得指定商品
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: string
   *         description: 商品代號
   *       - name: Authorization
   *         in: header
   *         required: true
   *         type: string
   *         description: Token
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/findGoodsResponse'
   */
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

  /**
   * @swagger
   * 
   * definitions:
   *   updateGoodsResponse:
   *     type: object
   *     properties:
   *       success:
   *         type: string
   *       code:
   *         type: string
   *       message:
   *         type: string
   *       data:
   *         type: object
   *         properties:
   *           goods_name:
   *             type: string
   * 
   * /goods/{id}:
   *   put:
   *     tags:
   *       - Goods
   *     produces:
   *       - application/json
   * 
   *     description: 更新商品
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: string
   *         description: 商品代號
   *       - name: Authorization
   *         in: header
   *         required: true
   *         type: string
   *         description: Token
   *       - name: goods_name
   *         in: formData
   *         required: true
   *         type: string
   *         description: 商品名稱
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/updateGoodsResponse'
   */
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


  /**
   * @swagger
   * 
   * definitions:
   *   deleteGoodsResponse:
   *     type: object
   *     properties:
   *       success:
   *         type: string
   *       code:
   *         type: string
   *       message:
   *         type: string
   *       data:
   *         type: object
   * 
   * /goods/{id}:
   *   delete:
   *     tags:
   *       - Goods
   *     produces:
   *       - application/json
   * 
   *     description: 刪除商品
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         type: string
   *         description: 商品代號
   *       - name: Authorization
   *         in: header
   *         required: true
   *         type: string
   *         description: Token
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/deleteGoodsResponse'
   */
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
