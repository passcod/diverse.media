'use strict'

const _ = require('lodash')
let env = {}
let pkginfo = {exports: {}}

require('dotenv').load()
require('pkginfo')(pkginfo)

function setif (name, key) {
  if (!key) {
    key = _.camelCase(name)
  }

  if (typeof process.env[name] !== 'undefined') {
    env[key] = process.env[name]
  }
}

setif('PORT')
setif('PRETTY')
setif('LOG_PATH')
setif('NODE_ENV', 'env')
setif('TRUST_PROXY')
setif('URL_ROOT')

env.proxy = !!env.trustProxy

module.exports = _.merge({
  env: 'development',
  logPath: 'logs',
  name: 'diverse.media',
  port: 5000,
  pretty: false,
  proxy: false,
  urlRoot: 'http://localhost:5000/'
}, pkginfo.exports, env)

process.env.NODE_ENV = module.exports.env
