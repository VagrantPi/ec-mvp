const Koa = require('koa');
const bodyParser = require('koa-body');
const helmet = require('koa-helmet');
const Router = require('koa-router');
const ResponseFormat = require('./ResponseFormat')
const User = require('./../controller/User.js')

class WebServer {
  constructor({ config, logger, db }) {
    this.config = config;
    this.logger = logger;
    this.db = db;
  }

  async start() {
    const app = new Koa();
    const router = new Router();

    const usercontroller = new User({ config: this.config, logger: this.logger, db: this.db })
    await usercontroller.initAdminUser()
      .catch(() => process.exit(1))

    router.post('/auth/login', async (ctx, next) => usercontroller.LoginUser(ctx, next));

    app
      .use(bodyParser({
        multipart: true,
        jsonLimit: '1mb',
        parsedMethods: ['POST', 'PUT', 'PATCH', 'Delete'],
      }))
      .use(async (ctx, next) => {
        // default return ServerError
        ctx.body = new ResponseFormat({ codesKey: 'ServerError' })

        await next()
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
