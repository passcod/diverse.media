const co = require('co');

exports.index = function *() {
    yield co(this.writer(this.app.resources)
    .then(function(data) {
        data.meta = {version: this.app.config.version};
        data.data.filter(function(o) {
            return o.id === '';
        })[0].id = 'resources';
        this.body = data;
    }.bind(this)));
};
