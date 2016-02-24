'use strict';

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
    path: '/coordinates',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/coordinates/latest',
    handler: function (request, reply) {
        reply('Hello, world!');
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
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});