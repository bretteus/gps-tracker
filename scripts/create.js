var pg = require('pg');
var connectionString = 'REPLACE WITH CONNECTION STRING';

var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE coordinates(' +
    'id SERIAL PRIMARY KEY, ' +
    'external_id VARCHAR(15) not null, ' +
    'timestamp VARCHAR(30) not null, ' +
    'latitude NUMERIC not null, ' +
    'longitude NUMERIC not null, ' +
    'message_type VARCHAR(10))');

query.on('end', function() { client.end(); });