'use strict'

const co = require('co')
const Work = require('../models/work')

exports.index = function *() {
  yield co(Work.run()
    .then(this.writer)
    .then(function (data) {
      this.body = data
    }.bind(this)))
}

exports.create = function *(next) {
  const payload = this.request.body.fields

  if (typeof payload.data !== 'object') {
    this.status = 400
    return yield next
  }

  const data = payload.data

  if (data.type !== 'works') {
    this.status = 400
    return yield next
  }

  if (typeof data.attributes === 'undefined') {
    this.status = 400
    return yield next
  }

  const hasId = typeof data.id !== 'undefined'
  if (hasId) {
    data.attributes.id = data.id
  }

  let work = new Work(data.attributes)
  yield co(work.saveAll()
    .then(function (work) {
      this.set('Location', this.links(work.id))
      this.status = hasId ? 204 : 201
      return work
    }.bind(this))
    .then(hasId ? function () {} : this.writer)
    .then(function (json) {
      this.body = json
    }.bind(this)))
}

exports.show = function *(next) {
  const id = this.params.id
  if (!id) {
    this.status = 400
    return yield next
  }

  yield co(Work.get(id).run()
    .then(this.writer)
    .then(function (data) {
      this.body = data
    }.bind(this)))
}

exports.destroy = function *(next) {
  const id = this.params.id
  if (!id) {
    this.status = 400
    return yield next
  }

  yield co(Work.get(id).run()
    .then(function (work) {
      return work.delete()
    })
    .then(function () {
      this.status = 204
    }.bind(this)))
}

exports.writerSchema = function () {
  let self = this
  return {
    attributes: ['name'],
    dataLinks: {
      self: function (work) { return self.links(work.id) }
    }
  }
}
