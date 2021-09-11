const Koa = require('koa');
const bodyParser = require('koa-body');
const helmet = require('koa-helmet');
const Router = require('koa-router');
const ResponseFormat = require('./ResponseFormat')
const User = require('./../controller/User')
const Goods = require('./../controller/Goods')

class WebServer {
  constructor({ config, logger, db }) {
    this.config = config;
    this.logger = logger;
    this.db = db;
  }

  async start() {
    const app = new Koa();
    const router = new Router();

    const userController = new User({ config: this.config, logger: this.logger, db: this.db })
    const goodsController = new Goods({ config: this.config, logger: this.logger, db: this.db })
    await userController.initAdminUser()
      .catch(() => process.exit(1))

    router.post('/auth/login', async (ctx, next) => userController.LoginUser(ctx, next));
    router.post('/goods/add', async (ctx, next) => goodsController.AddGoods(ctx, next));
    router.get('/goods', async (ctx, next) => goodsController.ListGoods(ctx, next));
    router.get('/goods/:id', async (ctx, next) => goodsController.FindGoods(ctx, next));
    router.put('/goods/:id', async (ctx, next) => goodsController.UpdateGoods(ctx, next));
    router.delete('/goods/:id', async (ctx, next) => goodsController.DeleteGoods(ctx, next));
    

    app
      .use(bodyParser({
        multipart: true,
        jsonLimit: '1mb',
        parsedMethods: ['POST', 'PUT', 'PATCH', 'Delete'],
      }))
      .use(async (ctx, next) => {
        try {
          // default return ServerError
          ctx.body = new ResponseFormat({ codesKey: 'ServerError' })
          await next()
        } catch (e) {
          if (e.message === 'jwt expired') {
            ctx.body = new ResponseFormat({ codesKey: 'TokenExpired' })
          } else if (e.message === 'permission denied') {
            ctx.body = new ResponseFormat({ codesKey: 'PermissionDenied' })
          }
        }
      })
      .use(helmet())
      .use(router.routes())
      .use(router.allowedMethods());

    app.listen(3000,(err)=>{
      if(err){
          this.logger.error(`\x1b[1m\x1b[31mServer   \x1b[0m\x1b[21m \x1b[1m\x1b[31m${err.message}\x1b[0m\x1b[21m`);
          throw err;
      }
      this.logger.log('\x1b[1m\x1b[32mServer   \x1b[0m\x1b[21m  listening at http://localhost:3000');
    })
  }

}
module.exports = WebServer;
