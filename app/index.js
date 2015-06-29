'use strict';

const config = require('./config');
const helmet = require('koa-helmet');
const koa = require('koa');

const app = koa();
app.name = config.name;
app.proxy = config.proxy;
app.resource = require('./resource')(app);
app.use(require('koa-logger')());
app.use(require('koa-json-logger')({
    name: config.name,
    path: config.logPath,
    jsonapi: true,
}));

app.use(helmet.defaults());
app.use(require('koa-jsonapi-headers')());
app.use(require('koa-better-body')());
app.use(require('koa-cors')());
app.use(require('koa-compressor')());
app.use(require('koa-json')({pretty: config.pretty}));
app.use(function *(next) {
    this.jsonapi = {
        reader: require('yayson').Store,
        writer: require('jsonapi-serializer'),
    };
    yield next;
});

Promise.all([
    app.resource('projects'),
]).then(function() {
    return app.resource('index');
}).then(function() {
    console.log('Starting server...');
    return app.listen(config.port, function() {
        console.log(`Application '${config.name}' running on port ${config.port}`);
    });
}).catch(function(err) {
    if (err.stack) {
        console.log(err.stack);
    } else {
        console.log(err);
    }

    process.exit(1);
});
