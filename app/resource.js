'use strict';

const _ = require('lodash');
const co = require('co');
const fs = require('mz/fs');
const links = require('./links');
const noop = function() {};
const path = require('path');
const Router = require('koa-router');
const writer = require('./writer');

const dir = path.join(__dirname, 'resources');
const findResource = co.wrap(function *(name) {
    const file = path.join(dir, `${name}.js`);
    const folder = path.join(dir, name, 'index.js');

    console.log(`Trying ${file}`);
    if (yield fs.exists(file)) {
        return require(file);
    }

    console.log(`Trying ${folder}`);
    if (yield fs.exists(folder)) {
        return require(folder);
    }

    throw `Resource ${name} not found!`;
});

function setupRoute(router, route, method, gen) {
    if (_.isFunction(gen)) {
        router[method](route, gen);
    }
}

function setupHelpers(name, router, resource) {
    router.use('/', function *(next) {
        const schema = (resource.writerSchema || noop).call(this);
        this.links = links.sub(name);
        this.writer = writer(name || 'resources', schema || {
            attributes: [],
            dataLinks: {
                self: function(thing) { return this.links(thing.id); }.bind(this),
            },
        });
        yield next;
    });
}

module.exports = function(app) {
    return function(name) {
        let router = new Router({
            prefix: `/${name}`,
        });

        return findResource(name).then(function(resource) {
            setupHelpers(name, router, resource);
            setupRoute(router, '/', 'get', resource.index);
            setupRoute(router, '/', 'post', resource.create);
            setupRoute(router, '/:id', 'get', resource.show);
            setupRoute(router, '/:id', 'patch', resource.update);
            setupRoute(router, '/:id', 'delete', resource.destroy);

            app.use(router.routes());
            app.use(router.allowedMethods());
            app.resources = app.resources || [];
            app.resources.push({id: name});
            console.log(`Set up resource ${name || 'index'} on /${name}.`);
        });
    };
};
