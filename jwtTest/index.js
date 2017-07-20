var Koa = require('koa');
const jwt = require('koa-jwt');
const token = require('jsonwebtoken')


var app = new Koa();

const Router = require('koa-router')

let home = new Router()

// 子路由1
home.get('/', async(ctx) => {
  let html = `
    <ul>
      <li><a href="/page/helloworld">/page/helloworld</a></li>
      <li><a href="/page/404">/page/404</a></li>
    </ul>
  `
  ctx.body = html
})

// 子路由2
let page = new Router()
page.get('/404', async(ctx) => {
  ctx.body = '404 page!' + token.sign({
    id: 123
  }, 'A very secret key')
}).get('/helloworld', jwt({
  secret: 'A very secret key', // Should not be hardcoded
}), async(ctx) => {
  console.log("ctx.state.user:" + JSON.stringify(ctx.state.user));
  ctx.body = 'helloworld page!'
})

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000);