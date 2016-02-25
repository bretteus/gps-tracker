'use strict';

var pg = require('pg');
var connectionString = 'DATABASE_URL';

var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE coordinates(' +
    'id SERIAL PRIMARY KEY, ' +
    'external_id VARCHAR(15) not null, ' +
    'timestamp TIMESTAMP not null, ' +
    'latitude NUMERIC not null, ' +
    'longitude NUMERIC not null, ' +
    'message_type VARCHAR(10))');

query.on('end', function() { client.end(); });