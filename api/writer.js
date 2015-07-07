'use strict'

const Jsonapi = require('jsonapi-serializer')

module.exports = function (type, schema) {
  return function (data) {
    return new Jsonapi(type, data, schema)
  }
}
