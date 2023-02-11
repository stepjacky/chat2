const { Configuration, OpenAIApi } = require("openai");
const Koa = require("koa");
const session = require('koa-session');
const app = new Koa();
const Router = require('@koa/router');
const { koaBody } = require('koa-body');


const render = require("@koa/ejs");
const path = require("path");
const serve = require('koa-static');
const Boom = require("boom");
const JSON5 = require('json5');


app.keys = ['chapt'];
const CONFIG = {
  key: 'koa.sess',
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
  secure: true, /** (boolean) secure cookie*/
  sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};

app.use(session(CONFIG, app));

app.use(serve(__dirname + "/statics"));
render(app, {
  root: path.join(__dirname, "view"),
  layout: "template",
  viewExt: "html",
  cache: false,
  debug: false,
});

app.use(koaBody());
//const apiKey = "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";
const apiKey = "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";
const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

const router = new Router();
router.post('/ask',async (ctx, next) => {
  try {
   
    const bobj =  JSON5.parse(ctx.request.body)
   
    const q = bobj.q;
    if (q) {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${q}\nA:`,
        temperature: 0,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\r"],
      });
      ctx.body = response.data.choices[0].text;
      next();
    }
  } catch (error) {
    console.log(error);
  }
});
router.get('/', async (ctx, next) => {
  await ctx.render("index");
});
app
  .use(router.routes())
  .use(router.allowedMethods({
    throw: true,
    notImplemented: () => new Boom.notImplemented(),
    methodNotAllowed: () => new Boom.methodNotAllowed()
  }));
app.listen(3000);