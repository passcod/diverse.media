'use strict';

exports.index = function *(next) {
    this.body = [];
    yield next;
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
