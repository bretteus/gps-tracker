'use strict';

var _ = require('underscore');
var db = require('./db-client');
var moment = require('moment');

var $ = {};

$.getCoordinates = function(request, reply) {

    var timestamp = request.params.timestamp ? moment(timestamp) : moment.utc().subtract(2, 'days');

    db.query('SELECT * FROM coordinates WHERE timestamp > $1 ORDER BY timestamp DESC LIMIT 100', [timestamp.format()], function(error, db_results) {
        var geoJson = {
            type: "FeatureCollection",
            features: []
        };

        if (error) {
            return reply(geoJson);
        }

        var lineCoordinates = [];
        geoJson.features = _.map(db_results.rows, function(coordinate) {
            lineCoordinates.push([Number(coordinate.longitude), Number(coordinate.latitude)]);
            return {
                geometry: {
                    type: "Point",
                    coordinates: [Number(coordinate.longitude), Number(coordinate.latitude)]
                },
                type: "Feature",
                id: coordinate.id,
                properties: {
                    description: 'test',
                    timestamp: coordinate.timestamp
                }
            };
        });
        geoJson.features.reverse();

        return reply(geoJson);
    });
};

$.getLatestCoordinates = function(request, reply) {
    reply('Hello, world!');
};

module.exports= $;