'use strict';

var $ = {};

var pg = require('pg');
var db = require('./db-client');
var spot = require('./spot-client');

$.pollGpsCoordinate = function() {
    spot.getLatestCoordinate(function(error, results) {
        if (error) {
            return console.log('Error response from Spot = ' + error.message);
        }
        var message = null;
        try {
            message = JSON.parse(results.body).response.feedMessageResponse.messages.message;
        } catch (error) {
            return console.log('Error parsing Spot response = ' + results.body);
        }
        console.log('Fetched latest coordinates from SPOT');

        db.query('SELECT * FROM coordinates ORDER BY external_id DESC LIMIT 1', null, function(err, db_results) {
            if(err) {
                console.log('Failed to fetch data from database');
                return console.log(err.message);
            }
            console.log('Fetched last saved coordinates');

            var db_result = db_results.rows[0];
            if (db_result && message.id.toString() === db_result.external_id) {
                return console.log('Duplicate data point retrieved and ignored');
            }
            if (db_result && message.dateTime <= db_result.timestamp) {
                return console.log('A later data coordinate has already been stored');
            }

            db.query("INSERT INTO coordinates(external_id, timestamp, latitude, longitude, message_type) values ($1, $2, $3, $4, $5)", [message.id.toString(), message.dateTime, message.latitude, message.longitude, message.messageType], function(er) {
                if(er) {
                    console.log('Failed to save data to database');
                    return console.log(er.message);
                }
                return console.log('New coordinates inserted =  ' + JSON.stringify(message));
            });
        });
    });
};

module.exports= $;