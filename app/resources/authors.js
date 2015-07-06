'use strict'

const co = require('co')
const Author = require('../models/author')

exports.index = function *() {
  yield co(Author.run()
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

  if (data.type !== 'authors') {
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

  let author = new Author(data.attributes)
  yield co(author.saveAll()
    .then(function (author) {
      this.set('Location', this.links(author.id))
      this.status = hasId ? 204 : 201
      return author
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

  yield co(Author.get(id).run()
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

  yield co(Author.get(id).run()
    .then(function (author) {
      return author.delete()
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
      self: function (author) { return self.links(author.id) }
    }
  }
}
