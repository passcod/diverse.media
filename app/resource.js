'use strict';

const _ = require('lodash');
const co = require('co');
const fs = require('mz/fs');
const path = require('path');
const Router = require('koa-router');

const dir = path.join(__dirname, 'resources');

let findResource = co.wrap(function *(name) {
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

function *notImplemented(next) {
    this.status = 501;
    this.body = {error: {title: 'Not Implemented'}};
    yield next;
}

function setupRoute(router, route, method, gen) {
    if (_.isFunction(gen)) {
        router[method](route, gen);
    } else {
        router[method](route, notImplemented);
    }
}

function resourceIndex(app) {
    let router = new Router();
    const Writer = require('jsonapi-serializer');

    return new Writer('resources', app.resources.map(function (res, i) {
        res.id = i;
        return res;
    }), {
        attributes: ['name', 'caps'],
    }).then(function(data) {
        router.get('/', function *(next) {
            this.body = data;
            yield next;
        });

        app.use(router.routes());
        app.use(router.allowedMethods());
        return true;
    });
}

module.exports = function(app) {
    return function(name) {
        if (name === 'index') {
            return resourceIndex(app);
        }

        let router = new Router({
            prefix: `/${name}`,
        });

        return findResource(name).then(function(resource) {
            setupRoute(router, '/', 'get', resource.index);
            setupRoute(router, '/', 'post', resource.create);
            setupRoute(router, '/:id', 'get', resource.show);
            setupRoute(router, '/:id', 'patch', resource.update);
            setupRoute(router, '/:id', 'delete', resource.destroy);

            app.use(router.routes());
            app.use(router.allowedMethods());
            app.resources = app.resources || [];
            app.resources.push({name: name, caps: Object.keys(resource)});
            console.log(`Set up resource ${name} on /${name}.`);
        });
    };
};
