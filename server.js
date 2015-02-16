// Require dependencies
var express = require('express'),
  exhbs = require('express-handlebars'),
  http = require('http'),
  mongoose = require('mongoose'),
  twitter = require('ntwitter'),
  routes = require('./routes'),
  config = require('./config'),
  streamHandler = require('./utils/streamHandler');

// Create an express instance and set a port
var app = express();
var port = process.env.PORT || 8080;

// Set handlebars as templating engine
app.engine('handlebars', exhbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on response
app.disable('etag');

// Connect to mongo
mongoose.connect('mongodb://localhost/react-tweets');

// Create a new ntwitter instance
var twit = new twitter(config.twitter);

// Index route
app.get('/', routes.index);

// Page Route
app.get('page/:page/:skip', routes.page);

// Set /public as our static content directory
app.use('/', express.static(__dirname + '/public'));

// FIRE
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});

// Initialize socket.io
var io = require('socket.io').listen(server);

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter', { track: 'Pliny the Younger, #PlinyTheYounger'}, function(stream) {
  streamHandler(stream, io);
});