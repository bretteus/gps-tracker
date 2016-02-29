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


        var count = 0;
        var lineCoordinates = [];
        geoJson.features = _.map(db_results.rows, function(coordinate) {
            count++;
            lineCoordinates.push([Number(coordinate.longitude), Number(coordinate.latitude)]);
            return {
                geometry: {
                    type: "Point",
                    coordinates: [Number(coordinate.longitude), Number(coordinate.latitude)]
                },
                type: "Feature",
                properties: {
                    id: coordinate.id,
                    latest: count === 1 ? true : false,
                    timestamp: coordinate.timestamp
                }
            };
        });
        geoJson.features.reverse();

        geoJson.features.push({
            geometry: {
                type: "LineString",
                coordinates: lineCoordinates
            },
            type: "Feature",
            properties: {
                id: 'line'
            }
        });

        return reply(geoJson);
    });
};

$.getLatestCoordinates = function(request, reply) {
    reply('Hello, world!');
};

module.exports= $;