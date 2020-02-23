const Koa = require('koa');
const koaRouter = require('koa-router');
const app = new Koa();
const koaBody = require('koa-body');
const toHTML = require("./render-core.js")
const router = koaRouter();

app.use(koaBody({
    jsonLimit: '2mb',
    formLimit: '1mb',
    textLimit: '1mb'
  }
));

router.post('/render', async (ctx, next) => {
  const mdContent = ctx.request.body.toString();
  return ctx.body = toHTML(mdContent);
});

app.use(router.routes());


let port = process.argv[2] || 3000;

console.log("listen at:" + port);
app.listen(port);