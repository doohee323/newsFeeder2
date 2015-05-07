'use strict';

module.exports = function(app, auth) {

    var words = require('../api/words');
    app.get('/bbs/:id', words.bbs);
    app.post('/loggingFromClient', words.loggingFromClient);
};
