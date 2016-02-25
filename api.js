'use strict';

var db = require('./db-client');
var moment = require('moment');

var $ = {};

$.getCoordinates = function(request, reply) {

    var timestamp = request.params.timestamp ? moment(timestamp) : moment.utc().subtract(2, 'days');

    db.query('SELECT * FROM coordinates WHERE timestamp > $1 ORDER BY timestamp DESC LIMIT 100', [timestamp.format()], function(error, db_results) {

        reply(JSON.stringify(db_results.rows));
    });
};

$.getLatestCoordinates = function(request, reply) {
    reply('Hello, world!');
};

module.exports= $;