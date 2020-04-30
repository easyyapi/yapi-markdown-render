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

const getIp = function (req) {
  let ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.connection.remoteAddres || '';
  if (ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
};

router.post('/render', async (ctx, next) => {
  const mdContent = ctx.request.body.toString();
  try {
    const ip = getIp(ctx.request);
    console.log('ip:', ip);
  } catch (e) {
    console.log('error to get ip:', e);
  }
  return ctx.body = toHTML(mdContent);
});

app.use(router.routes());


let port = process.argv[2] || 3000;

console.log("listen at:" + port);
app.listen(port);