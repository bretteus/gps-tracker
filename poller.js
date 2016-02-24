var $ = {};

var pg = require('pg');
var spot = require('./spot-client');

var connectionString = process.env.DATABASE_URL = 'postgres://zlgwclueszcgzc:CzExUSl4IDrIfIr7AvQLxMBI-m@ec2-54-83-204-104.compute-1.amazonaws.com:5432/d3mh325q56sohs?ssl=true';

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

        var db_results = [];
        // get latest gps point for comparison
        pg.connect(connectionString, function(err, client, done) {
            // Handle connection errors
            if(err) {
                done();
                console.log(err.message);
                return console.log('Failed to fetch data from database')
            }

            var query = client.query("SELECT * FROM coordinates ORDER BY external_id DESC LIMIT 1");

            query.on('row', function(row) {
                db_results.push(row);
                console.log('Coordinates pushed onto result array')
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                console.log(JSON.stringify(db_results));

                var db_result = db_results[0];
                if (db_result && message.id.toString() === db_result.external_id) {
                    done();
                    return console.log('Duplicate data point retrieved and ignored');
                }
                if (db_result && message.dateTime <= db_result.timestamp) {
                    done();
                    return console.log('A later data coordinate has already been stored');
                }
                // save gps point
                client.query("INSERT INTO coordinates(external_id, timestamp, latitude, longitude, message_type) values($1, $2, $3, $4, $5)", [message.id.toString(), message.dateTime, message.latitude, message.longitude, message.messageType]);

                done();

                return console.log('New coordinate saved: ' + JSON.stringify(message));
            });


        });

    });
};

module.exports= $;