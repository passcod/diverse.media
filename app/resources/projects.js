'use strict'

const co = require('co')
const Project = require('../models/project')

exports.index = function *() {
  yield co(Project.run()
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

  if (data.type !== 'projects') {
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

  let project = new Project(data.attributes)
  yield co(project.saveAll()
    .then(function (project) {
      this.set('Location', this.links(project.id))
      this.status = hasId ? 204 : 201
      return project
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

  yield co(Project.get(id).run()
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

  yield co(Project.get(id).run()
    .then(function (project) {
      return project.delete()
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
      self: function (project) { return self.links(project.id) }
    }
  }
}
