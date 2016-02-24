var request = require('request');

var $ = {};
var id = process.env.SPOT_QLID || 0;

$.getLatestCoordinate = function(callback) {
    var url = 'https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/' + id + '/latest.json';
    request.get({ url: url }, function(error, results) {
        if (error) {
            return callback(error);
        }
        return callback(null, results);
    });
};

module.exports = $;