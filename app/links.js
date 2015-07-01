'use strict';

const config = require('./config');
const urljoin = require('url-join');

let links = module.exports = function (resource, index) {
    return urljoin(
        config.urlRoot,
        resource,
        (typeof index !== 'undefined' && index !== null) ? index.toString() : ''
    );
};

module.exports.sub = function(resource) {
    return function(index) {
        return links(resource, index);
    };
};
