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

  async initAdminUser() {
    try {
      const findAdmin = await this.db.systemUser.findOne({
        where: { id: this.config.base.defaultAdminUUID }
      })
  
      if (!findAdmin) {
        const password = Utils.savePassword('admin', this.config.base.passwordSalt);
        await this.db.systemUser.create({ id: this.config.base.defaultAdminUUID, account: 'admin', password })
      }
    } catch (e) {
      this.logger.error(`initAdminUser error: ${e.message}`)
      throw e
    }
  }

  /**
   * @swagger
   * definitions:
   *   authResponse:
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
   *           account:
   *             type: string
   *           name:
   *             type: string
   *
   * /auth/login:
   *   post:
   *     tags:
   *       - User
   *     produces:
   *       - application/json
   * 
   *     description: Login 用戶登入系統並在Response Header Authorization取得token
   *     parameters:
   *       - name: account
   *         in: formData
   *         required: true
   *         type: string
   *         description: 使用者帳號
   *       - name: password
   *         in: formData
   *         required: true
   *         type: string
   *         description: 使用者密碼
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/definitions/authResponse'
   */
  async LoginUser(ctx) {
    try {
      this.logger.debug('LoginUser api')

      // only admin login
      const findAdmin = await this.db.systemUser.findOne({
        where: { id: this.config.base.defaultAdminUUID }
      })

      if (!findAdmin) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword', message: 'user not found' })
        return
      }

      const { account, password } = ctx.request.body
      if (!account, !password) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }
      const validPassword = Utils.verifyPassword(password, this.config.base.passwordSalt, findAdmin.password)
      if (!validPassword) {
        ctx.body = new ResponseFormat({ codesKey: 'InvalidAccountOrPassword' })
        return
      }

      const jwt = Utils.generateToken({
        userID: findAdmin.id,
        secret: this.config.jwt.secret,
        expiresIn: this.config.jwt.expiresIn,
        data: {
          role: 'admin'
        }
      })

      ctx.set('Authorization', jwt);
      ctx.body = new ResponseFormat({ codesKey: 'Success', data: {
        account,
        name: account
      } })
      return
    } catch (e) {
      this.logger.debug(`LoginUser api error: ${e.message}`)
    }
  }

}
module.exports = User;
