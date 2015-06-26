'use strict';

const db = require('../db');
const type = db.type;

module.exports = db.createModel('Project', {
    id: type.string().required(),
    name: type.string().required(),
});
