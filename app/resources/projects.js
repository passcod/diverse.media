'use strict';

const co = require('co');
const Project = require('../models/project');

exports.index = function *() {
    const Writer = this.jsonapi.writer;
    yield co(Project.run()
    .then(function(projects) {
        return new Writer('projects', projects, {
            attributes: ['name'],
        });
    })
    .then(function(data) {
        this.body = data;
    }.bind(this)));
};

exports.create = function *(next) {
    const payload = this.request.body.fields;

    if (typeof payload.data !== 'object') {
        this.status = 400;
        return yield next;
    }

    const data = payload.data;

    if (data.type !== 'projects') {
        this.status = 400;
        return yield next;
    }

    if (typeof data.attributes === 'undefined') {
        this.status = 400;
        return yield next;
    }

    let project  = new Project(data.attributes);
    const Writer = this.jsonapi.writer;
    yield co(project.saveAll()
    .then(function(project) {
        return new Writer('projects', project, {
            attributes: ['name'],
        });
    })
    .then(function(data) {
        this.body = data;
        this.response.set('Location', `/projects/${data.data.id}`);
        this.status = 201;
    }.bind(this)));
};

exports.show = function *(next) {
    const id = this.params.id;
    if (!id) {
        this.status = 400;
        return yield next;
    }

    const Writer = this.jsonapi.writer;
    yield co(Project.get(id).run()
    .then(function(projects) {
        return new Writer('projects', projects, {
            attributes: ['name'],
        });
    })
    .then(function(data) {
        this.body = data;
    }.bind(this)));
};

exports.destroy = function *(next) {
    const id = this.params.id;
    if (!id) {
        this.status = 400;
        return yield next;
    }

    yield co(Project.get(id).run()
    .then(function(project) {
        return project.delete();
    })
    .then(function() {
        this.status = 204;
    }.bind(this)));
};
