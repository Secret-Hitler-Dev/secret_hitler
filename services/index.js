require('dotenv').config();

const path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Player = require('./models/Player');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: true} ));
mongoose.Promise = global.Promise;

// The main instance of HTTP server
var server = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'application/build')));

// // server configuration
// var config = {};
// config.mongoURI = {
//     development: "mongodb://localhost:27017/serverDB",
// };

// Added for exposing our server instance to the test suite
module.exports = server;

// this is our MongoDB database
const dbRoute = process.env.DB_HOST;

// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'application/build', 'index.html'));
  });

var hostname = 'localhost';
var port = 8080;

// APIs go here

// Start listening for requests
server.listen(process.env.PORT || port, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});