'use strict'

var pg = require('pg');

var $ = {};

var connectionString = process.env.DATABASE_URL || '';

$.query = function(query, values, callback) {
    pg.connect(connectionString, function(err, client, done) {
        client.query(query, values, function(err, results) {
            done();
            return callback(err, results);
        })
    });
};

module.exports = $;