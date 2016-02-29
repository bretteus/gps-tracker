'use strict';

var api = require('./api');
var schedule = require('node-schedule');
var poller = require('./poller');

schedule.scheduleJob('*/3 * * * *', function() {
    console.log('Polling...');
    poller.pollGpsCoordinate();
});

const Hapi = require('hapi');

var port = process.env.PORT || 8080;

const server = new Hapi.Server();
server.connection({ port: port });

server.route({
    method: 'GET',
    path: '/api/coordinates',
    handler: function(request, reply) {
        api.getCoordinates(request, reply);
    }
});

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/map',
        handler: function (request, reply) {
            reply.file('./public/map.html');
        }
    });

    server.route({
        method: 'GET',
        path: '/static/leaflet-realtime',
        handler: function (request, reply) {
            reply.file('./static/leaflet.realtime.js');
        }
    });

    server.route({
        method: 'GET',
        path: '/static/leaflet-icon-pulse',
        handler: function (request, reply) {
            reply.file('./static/leaflet.icon.pulse.js');
        }
    });

server.route({
    method: 'GET',
    path: '/static/css/leaflet-icon-pulse',
    handler: function (request, reply) {
        reply.file('./static/leaflet.icon.pulse.css');
    }
});
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});