'use strict'

const db = require('../db')
const type = db.type

module.exports = db.createModel('Author', {
  id: type.string(),
  name: type.string().required().min(1)
})
