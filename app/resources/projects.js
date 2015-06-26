'use strict';

const co = require('co');
const Project = require('../models/project');

exports.index = function *() {
    const Writer = this.jsonapi.writer;
    yield co(Project.run().then(function(projects) {
        return new Writer('projects', projects, {
            attributes: ['name'],
        });
    }).then(function(data) {
        this.body = data;
    }.bind(this)));
};

exports.create = function *(next) {
    this.body = {};
    yield next;
};

exports.show = function *(next) {
    this.body = {};
    yield next;
};

exports.update = function *(next) {
    this.body = {};
    yield next;
};

exports.destroy = function *(next) {
    this.body = {};
    yield next;
};
