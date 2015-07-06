'use strict'

const config = require('./config')
const helmet = require('koa-helmet')
const koa = require('koa')

const app = koa()
app.config = config
app.name = config.name
app.proxy = config.proxy
app.resource = require('./resource')(app)
app.use(require('koa-logger')())
app.use(require('koa-json-logger')({
  name: config.name,
  path: config.logPath,
  jsonapi: true
}))

app.use(helmet.defaults())
app.use(require('koa-jsonapi-headers')())
app.use(require('koa-better-body')())
app.use(require('koa-cors')())
app.use(require('koa-compressor')())
app.use(require('koa-json')({pretty: config.pretty}))

Promise.all([
  app.resource('authors'),
  app.resource('works')
]).then(function () {
  return app.resource('')
}).then(function () {
  console.log('Starting server...')
  return app.listen(config.port, function () {
    console.log(`
    ${config.name} v${config.version} UP
      Listening on port ${config.port}, environment is ${config.env}
      Use 'npm run logs' or 'npm run errors' to tail logs
      Pretty user-friendly request log follows:
    `)
  })
}).catch(function (err) {
  if (err.stack) {
    console.log(err.stack)
  } else {
    console.log(err)
  }

  process.exit(1)
})
